package com.hedera.demo.utils;

import io.github.cdimascio.dotenv.Dotenv;

import java.util.HashMap;
import java.util.List;

import com.hedera.hashgraph.sdk.AccountId;
import com.hedera.hashgraph.sdk.Client;
import com.hedera.hashgraph.sdk.Hbar;
import com.hedera.hashgraph.sdk.PrivateKey;
import com.hedera.hashgraph.sdk.logger.LogLevel;
import com.hedera.hashgraph.sdk.logger.Logger;

public class EnvUtils {
    public static final String LOCAL_NETWORK_NAME = "localhost";

    private static final String LOCAL_CONSENSUS_NODE_ENDPOINT = "127.0.0.1:50211";

    private static final String LOCAL_MIRROR_NODE_GRPC_ENDPOINT = "127.0.0.1:5600";

    private static final AccountId LOCAL_CONSENSUS_NODE_ACCOUNT_ID = new AccountId(3);

    public static Client createClient(Dotenv dotenv, AccountId operatorId, PrivateKey operatorKey) throws InterruptedException {
        String network = dotenv.get("HEDERA_NETWORK");
        
        // Create and configure client
        Client client = forName(network, dotenv);
        client.setOperator(operatorId, operatorKey);
        // client.setLogger(new Logger(LogLevel.TRACE));
        return client;
    }

    private static Client forName(String network, Dotenv dotenv) throws InterruptedException {
        Client client;

        client = forLocalNetwork(dotenv);
        return client.setDefaultMaxTransactionFee(new Hbar(50));
    }

    private static Client forLocalNetwork(Dotenv dotenv) throws InterruptedException {
        var network = new HashMap<String, AccountId>();
        network.put(LOCAL_CONSENSUS_NODE_ENDPOINT, LOCAL_CONSENSUS_NODE_ACCOUNT_ID);

        return Client.forNetwork(network).setMirrorNetwork(List.of(LOCAL_MIRROR_NODE_GRPC_ENDPOINT));
    }
} 
