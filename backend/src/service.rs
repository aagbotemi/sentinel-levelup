use crate::{
    model::{
        AppError, AppState, DeleteResponse, PendingTransaction, Transaction, TransactionFilter,
    },
    rpc_queries::{
        get_block_query, get_erc20_balance_query, get_native_balance_query, get_transaction_query,
    },
    utils::get_rpc_url_with_chain_id,
};
use alloy::{
    primitives::{Address, ChainId, TxHash, U256},
    rpc::types::eth::{Block, BlockId, Transaction as AlloyTx},
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use log::{error, info};
use std::sync::Arc;
use uuid::Uuid;

use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[axum::debug_handler]
pub async fn create_transaction(
    State(state): State<Arc<AppState>>,
    Json(transaction): Json<Transaction>,
) -> Result<Json<Transaction>, AppError> {
    let result = sqlx::query_as::<_, Transaction>(
        "INSERT INTO transaction (tx_hash, block_hash, block_number, from_sender, to_reciever, tx_value, gas, gas_price, input, nonce, mempool_time, contract_type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *")
        .bind(transaction.tx_hash)
        .bind(transaction.block_hash)
        .bind(transaction.block_number)
        .bind(transaction.from_sender)
        .bind(transaction.to_reciever)
        .bind(transaction.tx_value)
        .bind(transaction.gas)
        .bind(transaction.gas_price)
        .bind(transaction.input)
        .bind(transaction.nonce)
        .bind(transaction.mempool_time)
        .bind(transaction.contract_type.to_owned())
        .fetch_one(&state.pool)
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    // dbg!(&result);
    Ok(Json(result))
}

#[axum::debug_handler]
pub async fn create_pending_transaction(
    State(state): State<Arc<AppState>>,
    Json(transaction): Json<PendingTransaction>,
) -> Result<Json<PendingTransaction>, AppError> {
    // dbg!(&transaction);

    let result = sqlx::query_as::<_, PendingTransaction>(
        "INSERT INTO pendingtransaction (pending_tx_hash, pending_block_number, pending_from_sender, pending_to_reciever, pending_tx_value, pending_gas, pending_contract_type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *")
        .bind(transaction.pending_tx_hash)
        .bind(transaction.pending_block_number)
        .bind(transaction.pending_from_sender)
        .bind(transaction.pending_to_reciever)
        .bind(transaction.pending_tx_value)
        .bind(transaction.pending_gas)
        .bind(transaction.pending_contract_type.to_owned())
        .fetch_one(&state.pool)
        .await
        .map_err(|e| {
            eprintln!("Database error: {:?}", e);
            AppError::DatabaseError(e.to_string())
        })?;

    Ok(Json(result))
}

pub async fn query_and_delete_pending_transactions(
    State(state): State<Arc<AppState>>,
) -> Result<Json<DeleteResponse>, AppError> {
    dbg!("Start a transaction");
    let mut tx = state
        .pool
        .begin()
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    // Query for all pending_tx_hash from the pendingtransaction table
    dbg!("Query for all pending_tx_hash from pendingtransaction table");
    let pending_tx_hashes: Vec<String> =
        sqlx::query_scalar("SELECT pending_tx_hash FROM pendingtransaction")
            .fetch_all(&mut *tx)
            .await
            .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    info!(
        "Found {} pending transactions in pendingtransaction table",
        pending_tx_hashes.len()
    );

    // Filter pending_tx_hashes that exist in the transaction table with a non-null block_number
    let mut tx_hashes_to_delete = Vec::new();

    for pending_tx_hash in &pending_tx_hashes {
        let exists_with_block_number: Option<String> = sqlx::query_scalar(
            "SELECT tx_hash FROM transaction WHERE tx_hash = $1 AND block_number IS NOT NULL",
        )
        .bind(pending_tx_hash)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

        if let Some(tx_hash) = exists_with_block_number {
            tx_hashes_to_delete.push(tx_hash);
        }
    }

    dbg!("Filtered transactions to delete based on block_number presence in transaction table");
    info!(
        "Found {} transactions with non-null block numbers to delete",
        tx_hashes_to_delete.len()
    );

    // If there are no transactions to delete, return early
    if tx_hashes_to_delete.is_empty() {
        return Ok(Json(DeleteResponse {
            message: "No matching transactions found with assigned block numbers".to_string(),
            rows_affected: 0,
        }));
    }

    // Delete the corresponding pending transactions from pendingtransaction table
    let query = format!("DELETE FROM pendingtransaction WHERE pending_tx_hash = ANY($1)");
    let result = sqlx::query(&query)
        .bind(tx_hashes_to_delete)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    let rows_affected = result.rows_affected();
    info!("Deleted {} pending transactions", rows_affected);

    // Step 5: Commit the transaction
    tx.commit()
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    Ok(Json(DeleteResponse {
        message: format!(
            "Deleted {} pending transactions with assigned block numbers",
            rows_affected
        ),
        rows_affected,
    }))
}

#[axum::debug_handler]
pub async fn get_pending_transactions(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<PendingTransaction>>, AppError> {
    info!("Fetching pending transactions");

    let transactions = sqlx::query_as::<_, PendingTransaction>("SELECT * FROM pendingtransaction")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| {
            error!("Database error: {}", e);
            AppError::DatabaseError(e.to_string())
        })?;

    info!("Found {} pending transactions", transactions.len());
    Ok(Json(transactions))
}

#[axum::debug_handler]
pub async fn get_transactions(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Transaction>>, AppError> {
    let transactions = sqlx::query_as::<_, Transaction>("SELECT * FROM transaction")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    dbg!(&transactions);
    Ok(Json(transactions))
}

#[axum::debug_handler]
pub async fn get_transaction_by_id(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Transaction>, AppError> {
    let transaction = sqlx::query_as::<_, Transaction>("SELECT * FROM transaction WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))?
        .unwrap();

    Ok(Json(transaction))
}

#[axum::debug_handler]
pub async fn filter_transactions(
    State(state): State<Arc<AppState>>,
    Query(filter): Query<TransactionFilter>,
) -> Result<Json<Vec<Transaction>>, AppError> {
    let mut query = String::from("SELECT * FROM transactions WHERE 1=1");
    let mut bindings = vec![];

    if let Some(min) = filter.gas_price_min {
        query += " AND gas_price >= $1";
        bindings.push(min.to_string());
    }

    if let Some(max) = filter.gas_price_max {
        query += &format!(" AND gas_price <= ${}", bindings.len() + 1);
        bindings.push(max.to_string());
    }

    if let Some(contract_type) = filter.contract_type {
        query += &format!(" AND contract_type = ${}", bindings.len() + 1);
        bindings.push(contract_type);
    }

    if let Some(min) = filter.block_number_min {
        query += &format!(" AND block_number >= ${}", bindings.len() + 1);
        bindings.push(min.to_string());
    }

    if let Some(max) = filter.block_number_max {
        query += &format!(" AND block_number <= ${}", bindings.len() + 1);
        bindings.push(max.to_string());
    }

    if let Some(min) = filter.mempool_time_min {
        query += &format!(" AND mempool_time >= ${}", bindings.len() + 1);
        bindings.push(min.to_string());
    }

    if let Some(max) = filter.mempool_time_max {
        query += &format!(" AND mempool_time <= ${}", bindings.len() + 1);
        bindings.push(max.to_string());
    }

    let mut db_query = sqlx::query_as::<_, Transaction>(&query);
    for binding in bindings {
        db_query = db_query.bind(binding);
    }

    let transactions = db_query
        .fetch_all(&state.pool)
        .await
        .expect("Failed to fetch filtered transactions");

    Ok(Json(transactions))
}

// append 0x to the block number
#[axum::debug_handler]
pub async fn get_block(
    State(state): State<Arc<AppState>>,
    Path((chainid, block_number)): Path<(ChainId, BlockId)>,
) -> Result<Json<Block>, AppError> {
    let rpc_url = get_rpc_url_with_chain_id(chainid);
    let block = get_block_query(rpc_url, block_number).await.unwrap();
    Ok(Json(block))
}

#[axum::debug_handler]
pub async fn get_transaction(
    State(state): State<Arc<AppState>>,
    Path((chainid, block_number, transaction_hash)): Path<(ChainId, BlockId, TxHash)>,
) -> Result<Json<AlloyTx>, AppError> {
    let rpc_url = get_rpc_url_with_chain_id(chainid);
    let transaction = get_transaction_query(rpc_url, transaction_hash)
        .await
        .unwrap();
    Ok(Json(transaction))
}

#[axum::debug_handler]
pub async fn get_native_balance(
    State(state): State<Arc<AppState>>,
    Path((chainid, address)): Path<(ChainId, Address)>,
) -> Result<Json<u128>, AppError> {
    let rpc_url = get_rpc_url_with_chain_id(chainid);
    let balance = get_native_balance_query(rpc_url, address).await.unwrap();
    let native_balance_hex = U256::from(balance);
    let native_balance: u128 = native_balance_hex.to::<u128>();
    Ok(Json(native_balance))
}

#[axum::debug_handler]
pub async fn get_erc20_balance(
    State(state): State<Arc<AppState>>,
    Path((chainid, contract_address, address)): Path<(ChainId, Address, Address)>,
) -> Result<Json<u128>, AppError> {
    let rpc_url = get_rpc_url_with_chain_id(chainid);
    let balance = get_erc20_balance_query(rpc_url, address, contract_address)
        .await
        .unwrap();

    let erc20_balance_hex = U256::from(balance);
    let erc20_balance: u128 = erc20_balance_hex.to::<u128>();

    Ok(Json(erc20_balance))
}
