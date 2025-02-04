import { ethers } from "hardhat";
import { UniswapV2Factory } from "../../typechain-types";

export async function deployFactory(deployer: any): Promise<UniswapV2Factory> {
  console.log("\n⏳ Deploying UniswapV2Factory with the account:", deployer.address);
  
  const factory = await ethers.deployContract("UniswapV2Factory", [deployer.address]);
  console.log("⏳ Waiting for deployment transaction...");
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ UniswapV2Factory deployed successfully!");
  console.log("📄 Factory address:", factoryAddress);
  
  return factory;
}
