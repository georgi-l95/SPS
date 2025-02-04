import { ethers } from "hardhat";
import { UniswapV2Router02 } from "../../typechain-types";

export async function swap(
  router: UniswapV2Router02,
  whbarAddress: string,
  tokenAddress: string,
  deployer: string
) {
  // Get token contract and symbol
  const token = await ethers.getContractAt("MyToken", tokenAddress);
  const tokenSymbol = await token.symbol();

  console.log(`\n🔄 Performing swap HBAR -> ${tokenSymbol}:`);

  // Amount of HBAR to swap (0.1 HBAR)
  const amountIn = ethers.parseEther("0.1");
  
  // Set a minimum amount of token we want to receive (with 5% slippage)
  const amounts = await router.getAmountsOut(amountIn, [whbarAddress, tokenAddress]);
  const amountOutMin = (amounts[1] * 95n) / 100n; // 5% slippage tolerance
  
  // Deadline 30 minutes from now
  const deadline = Math.floor(Date.now() / 1000) + 1800;

  console.log(`Swapping ${ethers.formatEther(amountIn)} HBAR for minimum ${ethers.formatUnits(amountOutMin, 18)} ${tokenSymbol}`);

  const tx = await router.swapExactHBARForTokens(
    amountOutMin,
    [whbarAddress, tokenAddress],
    deployer,
    deadline,
    { value: amountIn }
  );

  await tx.wait();
  console.log("✅ Swap completed successfully. Transaction hash:", tx.hash);
}
