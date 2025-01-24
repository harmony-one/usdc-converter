# USDC Converter

Unify USDC liquidity on Harmony with seamless 1:1 token conversions.

<img width="881" alt="image" src="https://github.com/user-attachments/assets/0c6f8f41-5748-4976-a476-97c098b07f49" />

## Features

- 🔄 Seamless 1:1 USDC conversion
- 💱 Unified liquidity across multiple USDC implementations
- 🔒 Secure smart contract implementation
- 📱 Responsive design for both desktop and mobile
- 🌐 Web3 integration with MetaMask
- ⚡ Optimized for Harmony Network

## Benefits

- 💧 Reduce fragmented liquidity
- 💪 Enhance capital efficiency
- 🔍 Improve price discovery
- 🌊 Deeper liquidity pools

## Smart Contracts

The project consists of two main smart contracts:

1. `Token.sol`: An ERC20 token contract with minting capabilities
2. `TokenConverter.sol`: Handles the conversion between different token types

### Deployed Addresses (Harmony Mainnet)

- Token Converter: `0x003f4d122982ccCcb5AF817dE055E5F841509CCC`
- Input Token 1: `0x5573264539929ed86F81bF18Ac05A99502557ACe`
- Input Token 2: `0x4c98df6344b4b1672ca784B45a9DAa79C6133De4`
- Output Token (USDC.e): `0x3BC1d310e8B1d52ab96D7fE43c9A90eb0EC6FE39`

## Tech Stack

### Frontend
- React with Vite
- TypeScript
- Tailwind CSS
- Web3.js
- HeadlessUI

### Smart Contracts
- Solidity ^0.8.26
- OpenZeppelin Contracts
- Hardhat
- Foundry

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ONETheo/usdc-converter.git
cd usdc-converter
```

2. Install dependencies:
```bash
# Install root project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Start the development server:
```bash
# From the root directory
npm run dev
```

### Smart Contract Development

1. Install Hardhat dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npm run compile
```

3. Run tests:
```bash
npm test
```

4. Deploy to Harmony mainnet:
```bash
# USDC Converter

Unify USDC liquidity on Harmony with seamless 1:1 token conversions.

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ONETheo/usdc-converter.git
cd usdc-converter
```

2. Install root project dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Start the development server:
```bash
npm run dev
```

### Smart Contract Development

1. Compile contracts:
```bash
npm run compile
```

2. Run tests:
```bash
npm test
```

3. Deploy to Harmony mainnet:
```bash
npx hardhat run ./scripts/deploy.js --network mainnet
```

## Contract Addresses (Harmony Mainnet)

- Token Converter: `0x003f4d122982ccCcb5AF817dE055E5F841509CCC`
- Input Token 1: `0x5573264539929ed86F81bF18Ac05A99502557ACe`
- Input Token 2: `0x4c98df6344b4b1672ca784B45a9DAa79C6133De4`
- Output Token (USDC.e): `0x3BC1d310e8B1d52ab96D7fE43c9A90eb0EC6FE39`
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Smart Contract Tests
```bash
# Run Hardhat tests
npm test

# Run Foundry tests
forge test
```

## Architecture
### Smart Contract Design

The system uses a two-contract architecture:

1. `Token.sol`:
   - ERC20 implementation
   - Minting capabilities
   - Ownership controls

2. `TokenConverter.sol`:
   - Manages token conversions
   - Maintains supported token list
   - Handles token transfers and minting

### Frontend Architecture

- React components with TypeScript
- Custom hooks for Web3 integration
- Responsive design with mobile-first approach
- State management using React hooks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
