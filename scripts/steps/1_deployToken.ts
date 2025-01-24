import { ethers } from "hardhat";
import { MyToken } from "../../typechain-types";

export async function deployToken(deployer: any): Promise<MyToken> {
  console.log("\n⏳ Deploying MyToken contract with the account:", deployer.address);
  
  const token = await ethers.deployContract("MyToken", [deployer.address]);
  console.log("⏳ Waiting for deployment transaction...");
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log("✅ Token deployed successfully!");
  console.log("📄 Token address:", tokenAddress);
  console.log("🔤 Token symbol:", await token.symbol());
  
  const balance = await token.balanceOf(deployer.address);
  console.log("💰 Deployer token balance:", ethers.formatUnits(balance));
  
  return token;
}
