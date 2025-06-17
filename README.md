# NFT Ticketing System

A decentralized NFT ticketing system built with Next.js, Hardhat, and Solidity.

## Features

- Create events with name, timestamp, ticket price, and total supply
- Mint NFT tickets (ERC-721) for events
- View available events
- Purchase tickets (mint NFT to wallet)
- View owned tickets
- Verify ticket ownership on-chain

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or any Web3 wallet

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nft-ticketing
```

2. Install dependencies:
```bash
npm install
```

## Development

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Copy the deployed contract address and update it in `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Deployment

1. Update the network configuration in `hardhat.config.js` with your preferred network details.

2. Deploy to the network:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

## Project Structure

- `/contracts` - Smart contracts
- `/scripts` - Deployment scripts
- `/src` - Frontend application
  - `/app` - Next.js pages
  - `/context` - React context providers
  - `/artifacts` - Compiled contract artifacts

## License

MIT
