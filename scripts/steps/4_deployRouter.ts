import { ethers } from "hardhat";
import { UniswapV2Router02 } from "../../typechain-types";

export async function deployRouter(
  deployer: any, 
  factoryAddress: string, 
  whbarAddress: string
): Promise<UniswapV2Router02> {
  console.log("\n⏳ Deploying UniswapV2Router02 with the account:", deployer.address);
  
  const router = await ethers.deployContract("UniswapV2Router02", [factoryAddress, whbarAddress]);
  console.log("⏳ Waiting for deployment transaction...");
  await router.waitForDeployment();
  
  const routerAddress = await router.getAddress();
  console.log("✅ UniswapV2Router02 deployed successfully!");
  console.log("📄 Router address:", routerAddress);
  
  return router;
} 