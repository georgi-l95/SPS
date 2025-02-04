package com.hedera.demo.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.json.JSONObject;

public class ContractUtils {
    public static String getBytecodeFromArtifact(String contractName) throws IOException {
        // Read the contract artifact from the artifacts directory
        String artifactPath = "../artifacts/contracts/" + contractName + ".sol/" + contractName + ".json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(artifactPath)));
        
        // Parse the JSON and extract the bytecode
        JSONObject artifact = new JSONObject(jsonContent);
        return artifact.getString("bytecode");
    }
} 