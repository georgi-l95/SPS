import { ethers } from "hardhat";
import { MyToken, UniswapV2Router02 } from "../../typechain-types";

export async function addLiquidity(
  token: MyToken,
  router: UniswapV2Router02,
  tokenAddress: string,
  deployer: any
) {
  try {
    // Step 1: Check balances before operation
    const tokenBalance = await token.balanceOf(deployer.address);
    const hbarBalance = await deployer.provider.getBalance(deployer.address);
    console.log("\n📊 Current balances:");
    console.log("Token balance:", ethers.formatUnits(tokenBalance, 18));
    console.log("HBAR balance:", ethers.formatEther(hbarBalance));

    // Step 2: Check initial allowance
    const routerAddress = await router.getAddress();
    const initialAllowance = await token.allowance(deployer.address, routerAddress);
    console.log("\n🔍 Initial allowance check:");
    console.log("Initial router allowance:", ethers.formatUnits(initialAllowance, 18));

    // Using a smaller amount for testing
    const amount = ethers.parseUnits("10", 18);
    console.log("\n⏳ Approving tokens for router...");
    const approveTx = await token.approve(routerAddress, amount);
    await approveTx.wait();
    console.log("✅ Token approval transaction confirmed!");

    // Check allowance after approval
    const afterApprovalAllowance = await token.allowance(deployer.address, routerAddress);
    console.log("\n🔍 Post-approval allowance check:");
    console.log("Router allowance after approval:", ethers.formatUnits(afterApprovalAllowance, 18));
    
    if (afterApprovalAllowance < amount) {
      throw new Error("Approval failed: allowance is less than requested amount");
    }
    console.log("✅ Approval verified successfully!");

    // Step 3: Add liquidity with more detailed logging
    const tenMinutesFromNow = Math.floor(Date.now() / 1000) + 600;
    console.log("\n⏳ Adding liquidity with parameters:");
    console.log("Token address:", tokenAddress);
    console.log("Token amount:", ethers.formatUnits(amount, 18));
    console.log("HBAR amount:", ethers.formatUnits(amount, 18));
    console.log("Deadline:", tenMinutesFromNow);
    
    const addLiquidityTx = await router.addLiquidityHBAR(
      tokenAddress,
      amount,
      amount,
      amount,
      deployer.address,
      tenMinutesFromNow,
      {
        value: amount,
        gasLimit: 3000000
      }
    );

    console.log("Transaction hash:", addLiquidityTx.hash);
    const receipt = await addLiquidityTx.wait();
    console.log("Transaction receipt:", receipt);
    console.log("✅ Liquidity added successfully!");
  } catch (error: any) {
    console.error("\n🚨 Detailed error information:");
    if (error.error) {
      console.error("Error details:", error.error);
    }
    if (error.transaction) {
      console.error("Transaction data:", error.transaction);
    }
    if (error.receipt) {
      console.error("Transaction receipt:", error.receipt);
    }
    throw error;
  }
} 