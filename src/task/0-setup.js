const fs = require("fs");
import { Keypair } from "@_koii/web3.js";
// const { KoiiStorageClient } = require("@_koii/storage-task-sdk");
import { KoiiStorageClient } from "@_koii/storage-task-sdk";

const client = new KoiiStorageClient();
const wallet = fs.readFileSync(
  "/Users/furqanqadri/Library/Application Support/KOII-Desktop-Node/namespace/furqan_stakingWallet.json",
  "utf-8",
);
const userStaking = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(wallet)));
const filePath = "/Users/furqanqadri/Desktop/data_analysis/data_analysis.py"; // replace with your actual file path

// Function to upload a file and get the CID
async function uploadFile() {
  try {
    const fileUploadResponse = await client.uploadFile(filePath, userStaking);
    const cid = fileUploadResponse.cid;
    console.log("File uploaded successfully. CID:", cid);
    return cid;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

// Main setup function to only upload the file and get CID
export async function setup() {
  console.log("Running setup...");

  // Upload the file and retrieve the CID
  const cid = await uploadFile();
  if (!cid) {
    console.error("File upload failed, CID not generated.");
    return;
  }

  // Log the CID as part of the initial setup
  console.log("Initial CID:", cid);

  // Return the initial state with just the CID
  const initialState = {
    cid: cid,
    initialized: true,
  };

  console.log("Initial State:", initialState);
  return initialState;
}
