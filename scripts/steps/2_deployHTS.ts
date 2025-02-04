import { AccountId, Client, LocalProvider, PrivateKey, Wallet } from "@hashgraph/sdk";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { MyToken, TokenCreateContract } from "../../typechain-types";
import { EventLog } from "ethers";

const createTokenCost = '50000000000000000000';

async function deployTokenCreateContract() {
  const tokenCreateFactory = await ethers.getContractFactory(
    "TokenCreateContract"
  );
  const tokenCreate = await tokenCreateFactory.deploy(
    { gasLimit: 1000000 }
  );

  return await ethers.getContractAt(
    "TokenCreateContract",
    await tokenCreate.getAddress()
  );
}

async function deployTokenTransferContract() {
  const tokenTransferFactory = await ethers.getContractFactory(
    "TokenTransferContract"
  );
  const tokenTransfer = await tokenTransferFactory.deploy(
    { gasLimit: 1000000 }
  );

  return await ethers.getContractAt(
    "TokenTransferContract",
    await tokenTransfer.getAddress()
  );
}

async function createFungibleToken(contract: TokenCreateContract, treasury: string) {
  const wallet = new ethers.Wallet("0x105d050185ccb907fba04dd92d8de9e32c18305e097ab41dadda21489a211524");
  const adminKey = Buffer.from(wallet.signingKey.compressedPublicKey.replace("0x", ""), "hex");
  const tokenAddressTx = await contract.createFungibleTokenWithSECP256K1AdminKeyPublic(wallet.address, adminKey, {
    value: BigInt(createTokenCost),
    gasLimit: 1_000_000,
  });

  const tokenAddressReceipt = await tokenAddressTx.wait();
  const tokenAddress = (tokenAddressReceipt?.logs[0] as EventLog).args[0];
  return tokenAddress;
}

export async function deployHTSToken(deployer: HardhatEthersSigner): Promise<MyToken> {
  console.log("\n🚀 Deploying HTS Token...");

  // Deploy TokenCreateContract
  console.log("📄 Deploying TokenCreateContract...");
  const tokenCreateContract = await deployTokenCreateContract();
  console.log("✅ TokenCreateContract deployed to:", await tokenCreateContract.getAddress());

  // Deploy TokenTransferContract
  // console.log("Deploying TokenTransferContract...");
  // const tokenTransferContract = await deployTokenTransferContract();
  // console.log("TokenTransferContract deployed to:", await tokenTransferContract.getAddress());

  const tokenAddress = await createFungibleToken(tokenCreateContract, await tokenCreateContract.getAddress());
  console.log("💎 Token deployed to:", tokenAddress);

  const token = await ethers.getContractAt("MyToken", tokenAddress, deployer);
  return token;
} 