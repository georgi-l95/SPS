package com.hedera.demo;

import com.hedera.hashgraph.sdk.Client;
import com.hedera.hashgraph.sdk.AccountId;
import com.hedera.hashgraph.sdk.PrivateKey;
import com.hedera.demo.steps.CreateAccount;
import com.hedera.demo.steps.DeployHTSToken;
import com.hedera.demo.steps.DeployToken;
import com.hedera.demo.utils.EnvUtils;

import io.github.cdimascio.dotenv.Dotenv;

public class DeployAndSwap {
    private final Client client;
    private final AccountId operatorId;
    private final PrivateKey operatorKey;

    public DeployAndSwap() throws InterruptedException {
        // Load environment variables
        Dotenv dotenv = Dotenv.load();
        
        // Initialize operator credentials
        this.operatorId = AccountId.fromString(dotenv.get("OPERATOR_ID"));
        this.operatorKey = PrivateKey.fromString(dotenv.get("OPERATOR_KEY"));
        
        // Initialize the Hedera client
        this.client = EnvUtils.createClient(dotenv, operatorId, operatorKey);
    }

    public void execute() throws Exception {
        System.out.println("\n👥 Operator Account:");
        System.out.println("🔑 Account ID: " + operatorId);
        
        // Step 1: Create account ECDSA account with Alias
        System.out.println("\n⏳ Step 1: Creating account for deployments...");
        CreateAccount.AccountInfo deployerAccount = new CreateAccount(client, operatorId, operatorKey).execute();
        System.out.println("✅ Account created successfully!");
        System.out.println("👤 Account ID: " + deployerAccount.getAccountId());
        System.out.println("📫 EVM Address: " + deployerAccount.getEvmAddress());
        
        // Step 2: Deploy HTS Token
        System.out.println("\n⏳ Step 2: Deploying HELI HTS Token...");
        DeployHTSToken.TokenInfo htsToken = new DeployHTSToken(client, deployerAccount).execute();
        System.out.println("✅ HELI HTS Token deployed successfully!");
        System.out.println("📝 Token ID: " + htsToken.getTokenId());
        System.out.println("📝 Token Address: " + htsToken.getAddress());
        
        // Step 3: Deploy USDC Token Contract
        System.out.println("\n⏳ Step 3: Deploying USDC Token Contract...");
        DeployToken.TokenInfo token = new DeployToken(client, deployerAccount).execute();
        System.out.println("✅ USDC Token deployed successfully!");
        System.out.println("📄 Token address: " + token.getAddress());
        System.out.println("🔤 Token symbol: " + token.getSymbol());
        System.out.println("💰 Deployer token balance: " + token.getBalance());
        
        // Future steps will be added here
    }

    public static void main(String[] args) {
        try {
            DeployAndSwap app = new DeployAndSwap();
            app.execute();
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
} 