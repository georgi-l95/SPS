package com.hedera.demo.steps;

import com.hedera.hashgraph.sdk.AccountCreateTransaction;
import com.hedera.hashgraph.sdk.AccountId;
import com.hedera.hashgraph.sdk.Client;
import com.hedera.hashgraph.sdk.Hbar;
import com.hedera.hashgraph.sdk.PrivateKey;
import com.hedera.hashgraph.sdk.PublicKey;
import com.hedera.hashgraph.sdk.TransactionResponse;

public class CreateAccount {
    private final Client client;
    private final AccountId operatorId;
    private final PrivateKey operatorKey;

    public static class AccountInfo {
        private final AccountId accountId;
        private final PrivateKey privateKey;
        private final String evmAddress;

        public AccountInfo(AccountId accountId, PrivateKey privateKey, String evmAddress) {
            this.accountId = accountId;
            this.privateKey = privateKey;
            this.evmAddress = evmAddress;
        }

        public AccountId getAccountId() {
            return accountId;
        }

        public PrivateKey getPrivateKey() {
            return privateKey;
        }

        public String getEvmAddress() {
            return "0x" + evmAddress;
        }
    }

    public CreateAccount(Client client, AccountId operatorId, PrivateKey operatorKey) {
        this.client = client;
        this.operatorId = operatorId;
        this.operatorKey = operatorKey;
    }

    public AccountInfo execute() throws Exception {
        // Generate ECDSA private key
        PrivateKey newPrivateKey = PrivateKey.generateECDSA();
        PublicKey newPublicKey = newPrivateKey.getPublicKey();
        String evmAddress = newPublicKey.toEvmAddress().toString();

        System.out.println(evmAddress);
        // Create new account and assign the public key
        AccountCreateTransaction transaction = new AccountCreateTransaction()
            .setKey(newPrivateKey)
            .setInitialBalance(new Hbar(5000))
            .setAlias("0x" + evmAddress);

        // Submit the transaction to a Hedera network
        TransactionResponse txResponse = transaction
            .freezeWith(client)
            .sign(operatorKey)
            .execute(client);

        // Get the new account ID
        AccountId newAccountId = txResponse.getReceipt(client).accountId;

        return new AccountInfo(newAccountId, newPrivateKey, evmAddress);
    }
} 
