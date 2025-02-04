import { UniswapV2Factory } from "../../typechain-types";

export async function createPair(factory: UniswapV2Factory, tokenA: string, tokenB: string) {
    console.log("\n⏳ Creating pair for tokens:");
    console.log("Token A:", tokenA);
    console.log("Token B:", tokenB);

    // Sort tokens (Uniswap requires tokens to be in order)
    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];
    
    console.log("\n🔍 Using sorted token addresses:");
    console.log("Token0:", token0);
    console.log("Token1:", token1);

    // Check if pair already exists
    const existingPair = await factory.getPair(token0, token1);
    if (existingPair !== "0x0000000000000000000000000000000000000000") {
      console.log("✅ Pair already exists at:", existingPair);
      return existingPair;
    }

    console.log("\n⏳ Creating pair transaction...");
    const tx = await factory.createPair(token0, token1, {
      gasLimit: 3000000
    });
    
    console.log("Transaction hash:", tx.hash);
    console.log("⏳ Waiting for pair creation transaction...");
    
    await tx.wait();

    // Verify pair was created
    const pairAddress = await factory.getPair(token0, token1);
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Pair creation failed - pair address is zero");
    }
    
    console.log("\n✅ Pair created successfully!");
    console.log("📄 Pair address:", pairAddress);
    
    return pairAddress;
}
