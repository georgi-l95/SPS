import { ethers } from "hardhat";
import { MyToken, UniswapV2Factory } from "../../typechain-types";

export async function verifySetup(
  token: MyToken,
  factory: UniswapV2Factory,
  whbarAddress: string,
  tokenAddress: string,
  deployer: any
) {
  console.log("\n🔍 Verifying setup:");
  
  // Check token balance
  const tokenBalance = await token.balanceOf(deployer.address);
  console.log("Token balance:", ethers.formatUnits(tokenBalance, 18));
  
  // Check if pair exists
  const pairAddress = await factory.getPair(whbarAddress, tokenAddress);
  console.log("Pair address:", pairAddress);
  if (pairAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Pair not created properly");
  }
  
  // Check HBAR balance
  const hbarBalance = await deployer.provider.getBalance(deployer.address);
  console.log("HBAR balance:", ethers.formatEther(hbarBalance));
} 