# SENTINEL
Sentinel is a RUST-based token-gated application, built on the Scroll blockchain, with the Reown AppKit integrated. It designed to handle blockchain transaction in the mempool. It can be used to monitor Pending Transactions and analyse them. It can also be used to check coin and token Balances of any address.

## Deployed and verified smart contract on Scroll
0xed0a67003F512E685BC8D57F01251188242c5D5e

See here: [https://sepolia.scrollscan.com/address/0xed0a67003F512E685BC8D57F01251188242c5D5e#code](https://sepolia.scrollscan.com/address/0xed0a67003F512E685BC8D57F01251188242c5D5e#code)

The Alchemy Scroll API is used as the Web Socket URL in our backend, and this is how we query the blockchain for data.

## Highlights
- Data access is token-gated. Everyone can see Completed Transactions, but if you want to see Pending Transactions and coin and token Balances of any address, you need to hold the Sentinel (SNTL) NFT in your wallet.
- We are querying our data directly from the blockchain, storing it (?) and presenting it in a way that makes sense to the user
- We're exposing APIs for other developers to use our queried data
- We're highlighting pending transactions for the convenience of users (people doing transactions and builders of blockchains)
- Data gotten from the blockchain can be used for several things

It utilizes the Tokio library for async runtime and the Serde library for JSON deserialization.

Take a look at it here: [https://sentinel-levelup.vercel.app/](https://sentinel-levelup.vercel.app/)

## Mint the NFT
- Ensure you have ETH on the Scroll Sepolia network
- Visit the Write Contract tab of the contract here [https://sepolia.scrollscan.com/address/0xed0a67003F512E685BC8D57F01251188242c5D5e#writeContract](https://sepolia.scrollscan.com/address/0xed0a67003F512E685BC8D57F01251188242c5D5e#writeContract)
- Connect your wallet using the "Connect to Web3" icon and follow the prompt
- Expand the "2. mintTo (0x755edd17)" tab and input the receiver address (the address you want to use to access the Pending Transactions and Balances)
- Click "Write" and follow the prompt
- Once the transaction is ready, you'll have the Sentinel (SNTL) in your address on the Scroll Sepolia network
- Now you can access the toke-gated parts of the tool

## Running Locally
Open a new terminal in the `sentinel-levelup` folder
### Navigate to the frontend
```
cd frontend
```
### Make a copy of the `.env.example` file in the frontend and change the name to `.env` and add `https://sentinel-levelup.onrender.com` as the argument to the `NEXT_PUBLIC_API` variable
### Install the node packages
```
npm i
```
### Build the frontend
```
npm run build
```

### Start the frontend
```
npm start
```
Now you can navigate to [http://localhost:3000](http://localhost:3000)

