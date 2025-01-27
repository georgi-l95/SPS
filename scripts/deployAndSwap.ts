import { ethers } from "hardhat";
import { deployToken } from "./steps/1_deployToken";
import { deployWHBAR } from "./steps/2_deployWHBAR";
import { deployFactory } from "./steps/3_deployFactory";
import { deployRouter } from "./steps/4_deployRouter";
import { createPair } from "./steps/5_createPair";
import { addLiquidity } from "./steps/6_addLiquidity";
import { verifySetup } from "./steps/7_verifySetup";
import { swap } from "./steps/8_swap";

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
  const pairAddress = await createPair(
    factory,
    whbarAddress,
    usdcAddress
  );

  // Step 6: Verify setup
  await verifySetup(usdc, factory, whbarAddress, usdcAddress, deployer);
  
  // Step 7: Add liquidity
  await addLiquidity(usdc, router, usdcAddress, pairAddress, deployer);

  // Step 8: Perform swap HBAR -> USDC
  await swap(router, whbarAddress, usdcAddress, deployer.address);

  // Check pair balances
  console.log("\n📊 Checking pair balances:");
  const pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);
  const pairTokenBalance = await usdc.balanceOf(pairAddress);
  const pairHBARBalance = await whbar.balanceOf(pairAddress);
  
  console.log("USDC in pair:", ethers.formatUnits(pairTokenBalance, 18));
  console.log("WHBAR in pair:", ethers.formatUnits(pairHBARBalance, 18));

  // Check deployer balances
  console.log("\n📊 Checking deployer balances:");
  console.log("USDC in deployer:", ethers.formatUnits(await usdc.balanceOf(deployer.address), 18));
  console.log("WHBAR in deployer:", ethers.formatUnits(await whbar.balanceOf(deployer.address), 18));
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
