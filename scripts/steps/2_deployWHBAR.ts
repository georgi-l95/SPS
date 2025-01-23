import { ethers } from "hardhat";
import { WrappedHbar } from "../../typechain-types";

export async function deployWHBAR(deployer: any): Promise<WrappedHbar> {
  console.log("\n⏳ Deploying WHBAR contract with the account:", deployer.address);
  
  const whbar = await ethers.deployContract("WrappedHbar", []);
  console.log("⏳ Waiting for deployment transaction...");
  await whbar.waitForDeployment();

  const whbarAddress = await whbar.getAddress();
  console.log("✅ WHBAR deployed successfully!");
  console.log("📄 WHBAR address:", whbarAddress);
  console.log("🔤 WHBAR symbol:", await whbar.symbol());
  
  return whbar;
} 