package com.hedera.demo.steps;

import com.hedera.hashgraph.sdk.*;

public class DeployHTSToken {
    private final Client client;
    private final CreateAccount.AccountInfo deployerAccount;

    public static class TokenInfo {
        private final TokenId tokenId;
        private final String address;

        public TokenInfo(TokenId tokenId, String address) {
            this.tokenId = tokenId;
            this.address = address;
        }

        public TokenId getTokenId() {
            return tokenId;
        }

        public String getAddress() {
            return address;
        }
    }

    public DeployHTSToken(Client client, CreateAccount.AccountInfo deployerAccount) {
        this.client = client;
        this.deployerAccount = deployerAccount;
    }

    public TokenInfo execute() throws Exception {
        // Create the token create transaction
        TokenCreateTransaction transaction = new TokenCreateTransaction()
            .setTokenName("HELI")
            .setTokenSymbol("HELI")
            .setDecimals(8)
            .setInitialSupply(1000000000) // 10 tokens with 8 decimal places
            .setTreasuryAccountId(deployerAccount.getAccountId())
            .setAdminKey(deployerAccount.getPrivateKey())
            .setSupplyKey(deployerAccount.getPrivateKey())
            .freezeWith(client);

        // Sign with the client operator private key and submit the transaction to a Hedera network
        TransactionResponse txResponse = transaction
            .sign(deployerAccount.getPrivateKey())
            .execute(client);

        // Request the receipt of the transaction
        TransactionReceipt receipt = txResponse.getReceipt(client);
        TokenId tokenId = receipt.tokenId;

        // Get the token address (in EVM format)
        String tokenAddress = "0x" + tokenId.toSolidityAddress();

        return new TokenInfo(tokenId, tokenAddress);
    }
} 