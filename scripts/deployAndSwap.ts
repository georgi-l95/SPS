import { ethers } from "hardhat";
import { deployToken } from "./steps/1_deployToken";
import { deployWHBAR } from "./steps/2_deployWHBAR";
import { deployFactory } from "./steps/3_deployFactory";
import { deployRouter } from "./steps/4_deployRouter";
import { createPair } from "./steps/5_createPair";
import { addLiquidity } from "./steps/6_addLiquidity";
import { verifySetup } from "./steps/7_verifySetup";

async function main() {
  // Get all signers
  const [deployer, account1, account2] = await ethers.getSigners();
  
  console.log("\n👥 Available accounts:");
  console.log("🔑 Deployer:", deployer.address);
  console.log("👤 Account1:", account1.address);
  console.log("👤 Account2:", account2.address);
  
  // Step 1: Deploy USDC using deployer account
  const usdc = await deployToken(deployer);
  const usdcAddress = await usdc.getAddress();
  
  // Step 2: Deploy WHBAR using deployer account
  const whbar = await deployWHBAR(deployer);
  const whbarAddress = await whbar.getAddress();
  
  // Step 3: Deploy UniswapV2Factory
  const factory = await deployFactory(deployer);
  const factoryAddress = await factory.getAddress();
  
  // Step 4: Deploy UniswapV2Router02 with factory and WHBAR addresses
  const router = await deployRouter(
    deployer,
    factoryAddress,
    whbarAddress
  );
  
  // Step 5: Create WHBAR-USDC pair
  await createPair(
    factory,
    whbarAddress,
    usdcAddress
  );

  // Step 6: Verify setup
  await verifySetup(usdc, factory, whbarAddress, usdcAddress, deployer);
  
  // Step 7: Add liquidity
  await addLiquidity(usdc, router, usdcAddress, deployer);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 