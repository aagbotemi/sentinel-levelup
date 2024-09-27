import React from 'react';

const NetworkDropdown = ({ selectedNetwork, handleChange }: { selectedNetwork: any, handleChange: any }) => {
    return (
        <div>
            <select id="network-select" value={selectedNetwork} onChange={handleChange}>
                <option value="">--Please choose an option--</option>
                <option value="1">Mainnet</option>
                <option value="11155111">Sepolia</option>
                <option value="534352">Scroll</option>
                <option value="534351">Scroll Sepolia</option>
                <option value="8453">Base</option>
                <option value="84531">Base Sepolia</option>
                <option value="10">Optimism</option>
                <option value="420">Optimism Sepolia</option>
                <option value="56">Binance Smart Chain</option>
                <option value="137">Polygon POS</option>
                <option value="1101">Polygon ZKEVM</option>
                <option value="42161">ArbitrumOne</option>
                <option value="421614">ArbitrumOne Sepolia</option>
                <option value="324">Zksync</option>
            </select>
        </div>
    );
};

export default NetworkDropdown;
