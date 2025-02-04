import { ethers } from "hardhat";
import { deployToken } from "./steps/1_deployToken";
import { deployHTSToken } from "./steps/2_deployHTS";
import { deployWHBAR } from "./steps/3_deployWHBAR";
import { deployFactory } from "./steps/4_deployFactory";
import { deployRouter } from "./steps/5_deployRouter";
import { createPair } from "./steps/6_createPair";
import { verifySetup } from "./steps/7_verifySetup";
import { addLiquidity } from "./steps/8_addLiquidity";
import { swap } from "./steps/9_swap";

async function main() {
  // Get all signers
  const [deployer, account1, account2] = await ethers.getSigners();
  
  console.log("\n👥 Available accounts:");
  console.log("🔑 Deployer:", deployer.address);
  console.log("👤 Account1:", account1.address);
  console.log("👤 Account2:", account2.address);
  
  // Step 1: Deploy USDC token
  const usdc = await deployToken(deployer);
  const usdcAddress = await usdc.getAddress();

  // Step 2: Deploy HELI token (HTS)
  const heli = await deployHTSToken(deployer);
  const heliAddress = await heli.getAddress();
  
  // Step 3: Deploy WHBAR token
  const whbar = await deployWHBAR(deployer);
  const whbarAddress = await whbar.getAddress();
  
  // Step 4: Deploy UniswapV2Factory
  const factory = await deployFactory(deployer);
  const factoryAddress = await factory.getAddress();
  
  // Step 5: Deploy UniswapV2Router02
  const router = await deployRouter(
    deployer,
    factoryAddress,
    whbarAddress
  );
  
  // Step 6a: Create WHBAR-USDC pair
  const usdcPairAddress = await createPair(
    factory,
    whbarAddress,
    usdcAddress
  );

  // Step 6b: Create WHBAR-HELI pair
  const heliPairAddress = await createPair(
    factory,
    whbarAddress,
    heliAddress
  );

  // Step 7a: Verify WHBAR-HELI setup
  await verifySetup(heli, factory, whbarAddress, heliAddress, deployer);
  
  // Step 7b: Verify WHBAR-USDC setup
  await verifySetup(usdc, factory, whbarAddress, usdcAddress, deployer);

  // Step 8a: Add WHBAR-HELI liquidity
  await addLiquidity(heli, router, heliAddress, heliPairAddress, deployer);

  // Step 8b: Add WHBAR-USDC liquidity
  await addLiquidity(usdc, router, usdcAddress, usdcPairAddress, deployer);

  // Step 9a: Perform swap HBAR -> USDC
  await swap(router, whbarAddress, usdcAddress, deployer.address);

  // Step 9b: Perform swap HBAR -> HELI
  await swap(router, whbarAddress, heliAddress, deployer.address);
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
