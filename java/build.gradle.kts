plugins {
    java
    application
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

application {
    mainClass.set("com.hedera.demo.DeployAndSwap")
}

dependencies {
    // Hedera Java SDK
    implementation("com.hedera.hashgraph:sdk:2.31.0")
    
    // gRPC Netty Shaded
    runtimeOnly("io.grpc:grpc-netty-shaded:1.53.0")
    
    // .env file support
    implementation("io.github.cdimascio:dotenv-java:3.0.0")
    
    // JSON Support
    implementation("org.json:json:20231013")
    
    // Logging
    runtimeOnly("org.slf4j:slf4j-simple:2.0.9")
}

tasks.withType<Jar> {
    manifest {
        attributes["Main-Class"] = "com.hedera.demo.DeployAndSwap"
    }
    
    // Include all dependencies in the jar
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}

// Task to run DeployAndSwap
tasks.register<JavaExec>("deployAndSwap") {
    group = "application"
    description = "Runs the DeployAndSwap application"
    
    classpath = sourceSets["main"].runtimeClasspath
    mainClass.set("com.hedera.demo.DeployAndSwap")
    
    // Working directory set to project root
    workingDir = rootDir
} 