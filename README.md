# SPS (Swaps Per Second)

## Overview
This repository contains a deployment and benchmarking system for Uniswap contracts on Hedera. The main purpose is to measure and test the maximum number of token swaps that can be executed per second on the Hedera network using Uniswap's smart contract architecture.

## Description
The system implements a series of automated deployments and tests to:
1. Deploy ERC20 tokens for testing
2. Deploy Uniswap V2 core contracts (Factory, Router)
3. Create liquidity pools
4. Execute and measure swap transactions

### System Components
- Uniswap V2 core contracts
- Custom ERC20 tokens for testing
- Hardhat configuration for both local and Hedera network testing
- Deployment and benchmarking scripts

### Network Configuration
The project supports two networks:
- Internal Hardhat Network: For initial testing and development
- Local Network: For running against a local Ethereum-compatible node before Hedera deployment

## How To Run

### Prerequisites
1. Node.js and npm installed
2. Git
3. Access to Hedera testnet/mainnet (for actual benchmarking)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd sps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment:
   - Copy the example configuration file:
     ```bash
     cp hardhat.config.ts.example hardhat.config.ts
     ```
   - Update `hardhat.config.ts` with your private keys if using local network

### Deployment Process
The deployment script executes the following steps in order:

1. Token Deployment
   - Deploy Token A (ERC20)
   - Deploy Token B (ERC20)
   - Mint initial supply for testing

2. Uniswap Core Deployment
   - Deploy UniswapV2Factory
   - Deploy UniswapV2Router02
   - Initialize WETH contract

3. Pool Setup
   - Create Token A/B pair through Factory
   - Add initial liquidity to the pool
   - Configure swap parameters

4. Benchmarking Setup
   - Set up test accounts
   - Fund accounts with tokens
   - Prepare swap transactions

### Running Tests
- Using internal Hardhat network:
  ```bash
  npx hardhat test
  ```

- Using local network:
  ```bash
  npx hardhat test --network local
  ```

### Running Benchmarks
- To deploy and run benchmarks on internal Hardhat network:
  ```bash
  npx hardhat run scripts/deploy.ts
  ```

- To deploy and run benchmarks on local network:
  ```bash
  npx hardhat run scripts/deploy.ts --network local
  ```

### Measuring Results
The benchmarking results will show:
- Number of successful swaps per second
- Average transaction confirmation time
- Gas usage statistics
- Success/failure ratio of swap operations