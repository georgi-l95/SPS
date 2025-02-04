package com.hedera.demo.steps;

import com.hedera.hashgraph.sdk.*;

import com.hedera.demo.utils.ContractUtils;

public class DeployToken {
    private final Client client;
    private final CreateAccount.AccountInfo deployerAccount;

    public static class TokenInfo {
        private final String address;
        private final String symbol;
        private final String balance;

        public TokenInfo(String address, String symbol, String balance) {
            this.address = address;
            this.symbol = symbol;
            this.balance = balance;
        }

        public String getAddress() {
            return address;
        }

        public String getSymbol() {
            return symbol;
        }

        public String getBalance() {
            return balance;
        }
    }

    public DeployToken(Client client, CreateAccount.AccountInfo deployerAccount) {
        this.client = client;
        this.deployerAccount = deployerAccount;
    }
    
    public TokenInfo execute() throws Exception {
        final String deployerAddress = deployerAccount.getEvmAddress();
        
        // Remove "0x" prefix if present and pad address to 32 bytes
        String addressWithoutPrefix = deployerAddress.startsWith("0x") ? 
            deployerAddress.substring(2) : deployerAddress;
        System.out.println("Address without prefix: " + addressWithoutPrefix);
        String paddedAddress = String.format("%64s", addressWithoutPrefix).replace(' ', '0');
        System.out.println("Padded address: " + paddedAddress);
        
        // FileCreateTransaction fileCreateTx = new FileCreateTransaction()
        //         .setKeys(deployerAccount.getPrivateKey().getPublicKey())
        //         .setFileMemo("USDC Token")
        //         .setContents(ContractUtils.getBytecodeFromArtifact("MyToken") + paddedAddress);

        // TransactionResponse fileCreateTxResponse = fileCreateTx.setMaxTransactionFee(Hbar.from(2)).freezeWith(client).sign(deployerAccount.getPrivateKey()).execute(client);
        // TransactionReceipt fileCreateTxReceipt = fileCreateTxResponse.getReceipt(client);

        // FileId newFileId = fileCreateTxReceipt.fileId;
        // System.out.println("💾 Created new bytecode file with ID: " + newFileId);

        // Deploy MyToken contract
        ContractCreateTransaction contractCreateTransaction = new ContractCreateTransaction()
        .setBytecode(ContractUtils.getBytecodeFromArtifact("MyToken").getBytes())
        .setConstructorParameters(new ContractFunctionParameters().addAddress(deployerAddress))
        .freezeWith(client);

        // Sign and submit the transaction
        TransactionResponse contractCreateTxResponse = contractCreateTransaction
            .sign(deployerAccount.getPrivateKey())
            .execute(client);

        // Get the receipt
        TransactionReceipt contractCreateTxReceipt = contractCreateTxResponse.getReceipt(client);
        ContractId contractId = contractCreateTxReceipt.contractId;
        String contractAddress = "0x" + contractId.toSolidityAddress();

        // Get token details using contract calls
        ContractCallQuery symbolQuery = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(30000)
            .setFunction("symbol");

        ContractCallQuery balanceQuery = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(30000)
            .setFunction("balanceOf", new ContractFunctionParameters().addAddress(deployerAddress));

        String symbol = symbolQuery.execute(client).getString(0);
        String balance = balanceQuery.execute(client).getUint256(0).toString();

        return new TokenInfo(contractAddress, symbol, balance);
    }
} 