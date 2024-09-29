use async_tungstenite::tungstenite::protocol::Message;
use axum::{extract::State, Json};
use futures_util::{SinkExt, StreamExt};
use log::{error, info, warn};
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
    result,
    sync::Arc,
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use tokio::{fs::File, io::AsyncWriteExt, time::interval};
use uuid::Uuid;

use crate::{
    connection::connect_websocket,
    mempool::check_contract_type::check_account_type,
    model::{
        AppError, AppState, Config, ContractType, PendingTransaction, Transaction, TxHashResponse,
    },
    service::{
        create_pending_transaction, create_transaction, query_and_delete_pending_transactions,
    },
    utils::{csv_writer, hex_to_int64, trim_str},
};

pub async fn scan_mempool(config: &Config, state: &Arc<AppState>) -> Result<(), AppError> {
    let (mut write, read) = connect_websocket(&config.web_socket_url).await?.split();

    // CSV writer
    let mut writer = csv_writer("transactions.csv").map_err(|e| AppError::IoError(e))?;

    // Subscribe to pending transactions
    let subscribe_msg = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_subscribe",
        "params": ["newPendingTransactions"]
    });

    write.send(Message::Text(subscribe_msg.to_string())).await?;
    let mut fused_read = read.fuse();

    // HashMap to store transaction times
    let mut tx_times: HashMap<String, i64> = HashMap::new();
    let mut pending_txs: HashSet<String> = HashSet::new();
    // let mut block_pending_txs: HashSet<String, PendingTransaction> = HashMap::new();
    // Ticker that fires every 1 second
    let mut interval = interval(Duration::from_secs(1));
    loop {
        tokio::select! {

            Some(message) = fused_read.next() => {
                match message {
                    Ok(Message::Text(res)) => {
                        if let Ok(response) = serde_json::from_str::<TxHashResponse>(&res) {
                            let tx_hash = response.params.result;
                            let tx_data = json!({
                                "jsonrpc": "2.0",
                                "id": 1,
                                "method": "eth_getTransactionByHash",
                                "params": [&tx_hash]
                            });
                            // write.send(Message::Text(tx_data.to_string())).await?;

                            // if let Some(Ok(Message::Text(tx_data_response_text))) = fused_read.next().await {

                            //     let check_tx_data_response_text: Value = serde_json::from_str(&tx_data_response_text)?;

                            //     if let Some(result) = check_tx_data_response_text.get("result") {

                            //         dbg!(&result);
                            //     }
                            // }

                            let start_time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as i64;
                            tx_times.insert(tx_hash.clone(), start_time);
                            pending_txs.insert(tx_hash.clone());
                            info!("New pending transaction: {}", tx_hash);
                        }
                    }
                    Ok(Message::Close(_)) => {
                        warn!("WebSocket closed");
                        return Err(AppError::Other("WebSocket closed".into()));
                    }
                    Err(e) => {
                        error!("Error: {}", e);
                        return Err(AppError::WebSocketError(e));
                    }
                    _ => {}
                }
            }
            _ = interval.tick() => {
                info!("Checking pending transactions...");

                for tx_hash in pending_txs.clone() {
                    let tx_data = json!({
                        "jsonrpc": "2.0",
                        "id": 1,
                        "method": "eth_getTransactionByHash",
                        "params": [&tx_hash]
                    });
                    write.send(Message::Text(tx_data.to_string())).await?;

                    if let Some(Ok(Message::Text(response_text))) = fused_read.next().await {
                        let tx_response: Value = serde_json::from_str(&response_text)?;








                        if let Some(result) = tx_response.get("result") {
                            let _contract_type =  check_contract_status(config, result).await?;

                            // let pending_block_number = result["blockNumber"].clone();
                            let pending_block_number = match result["blockNumber"].as_str() {
                                Some(hex_str) => Some(hex_to_int64(&Value::String(hex_str.to_string()))?),
                                None => None,
                            };
                            let pending_from_sender = trim_str(&result["from"]);
                            let pending_to_reciever = trim_str(&result["to"]);
                            let pending_tx_value = hex_to_int64(&result["value"])?;
                            let pending_gas = hex_to_int64(&result["gas"])?;

                            let pending_transaction = PendingTransaction {
                                id: Uuid::default(),
                                pending_tx_hash: tx_hash.clone(),
                                pending_block_number,
                                pending_from_sender,
                                pending_to_reciever,
                                pending_gas,
                                pending_tx_value,
                                pending_contract_type: _contract_type,
                            };

                            if pending_block_number == None {
                                let _ = create_pending_transaction(State(state.clone()), Json(pending_transaction)).await?;
                            }


                            if result["blockHash"].is_string() {
                                if let Some(start_time) = tx_times.remove(&tx_hash) {
                                    let block_hash = trim_str(&result["blockHash"]);
                                    let block_number = hex_to_int64(&result["blockNumber"])?;
                                    let from_sender = trim_str(&result["from"]);
                                    let to_reciever = trim_str(&result["to"]);
                                    let tx_value = hex_to_int64(&result["value"])?;
                                    let gas = hex_to_int64(&result["gas"])?;
                                    let gas_price = hex_to_int64(&result["gasPrice"])?;
                                    let input = trim_str(&result["input"]);
                                    let nonce = hex_to_int64(&result["nonce"])?;

                                    let end_time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as i64;
                                    let mempool_time = end_time - start_time;

                                    let transaction = Transaction {
                                        id: Uuid::default(),
                                        tx_hash: tx_hash.clone(),
                                        block_hash,
                                        block_number,
                                        from_sender,
                                        to_reciever,
                                        tx_value,
                                        gas,
                                        gas_price,
                                        input,
                                        nonce,
                                        mempool_time,
                                        contract_type: _contract_type,
                                    };

                                    // Convert block_number to a String
                                    let blck_number_str = &transaction.block_number.to_string();
                                    // Write to CSV
                                    writer.write_record(&[
                                        &tx_hash,
                                        &mempool_time.to_string(),
                                        &transaction.gas_price.to_string(),
                                        &blck_number_str,
                                        &_contract_type.as_str().to_string()
                                    ])?;

                                        // dbg!("this is it");
                                    // Save response to file
                                    let file_path = format!("responses/{}.json", tx_hash);
                                    let mut file = File::create(&file_path).await?;
                                    file.write_all(serde_json::to_string(&transaction)?.as_bytes()).await?;
                                    writer.flush()?;



                                    let _ = create_transaction(State(state.clone()), Json(transaction)).await?;
                                    let _ = query_and_delete_pending_transactions(State(state.clone())).await?;

                                    // Remove from pending txn
                                   pending_txs.remove(&tx_hash);

                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

pub async fn check_contract_status(
    config: &Config,
    result: &Value,
) -> Result<ContractType, AppError> {
    let check_contract_code = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getCode",
        "params": [&result["to"]]
    });

    let (mut write, mut read) = connect_websocket(&config.web_socket_url).await?.split();

    write
        .send(Message::Text(check_contract_code.to_string()))
        .await?;
    let mut _contract_type: ContractType = ContractType::ExternallyOwnedAccount;

    // check the contract type
    if let Some(Ok(Message::Text(check_contract_code_response_text))) = read.next().await {
        let check_contract_code_tx_response: Value =
            serde_json::from_str(&check_contract_code_response_text)?;
        let code = &check_contract_code_tx_response["result"];

        _contract_type = check_account_type(&code);
    }

    Ok(_contract_type)
}
