import fs from "fs";
import mongoose from "mongoose";
import { Keypair } from "@_koii/web3.js";
import { KoiiStorageClient } from "@_koii/storage-task-sdk";

// MongoDB connection
const mongoURI =
  "mongodb+srv://furqan:hello123@deverify.az0xd.mongodb.net/de_verify?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the MongoDB schema and model for the `documents` collection
const fileSchema = new mongoose.Schema({
  cid: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploader: { type: String, required: true },
});

// Specify the collection name explicitly using the third argument in mongoose.model
const File = mongoose.model("File", fileSchema, "documents");

// Initialize Koii Storage Client and Keypair
const client = new KoiiStorageClient();
const wallet = fs.readFileSync(
  "/Users/furqanqadri/Library/Application Support/KOII-Desktop-Node/namespace/furqan_stakingWallet.json",
  "utf-8",
);
const userStaking = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(wallet)));
const filePath = "/Users/furqanqadri/Desktop/data_analysis/output.json"; // replace with your actual file path

export { File };

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

// Function to save file metadata to MongoDB
async function saveFileMetadata(cid) {
  try {
    const fileRecord = new File({
      cid,
      fileName: filePath.split("/").pop(), // Extract file name from path
      uploader: "user123", // Replace with actual user identifier if available
    });

    const savedFile = await fileRecord.save();
    console.log("File metadata saved to MongoDB:", savedFile);
  } catch (error) {
    console.error("Error saving file metadata to MongoDB:", error);
  }
}

async function findFileByCid(cid) {
  try {
    const file = await File.findOne({ cid });
    const found = file ? 1 : 0;

    if (found) {
      console.log("The File has been found and verified", file);
    } else {
      console.log("No file found with the given CID.");
    }

    return { found, file };
  } catch (error) {
    console.error("Error finding file by CID:", error);
    return { found: 0, file: null };
  }
}

// Example usage:
findFileByCid(
  "bafybeiafqergy7f67ezucfkp5ctfsrcin7sjdg2lbxfscnw7gbuwzsn2j4",
).then((result) => {
  console.log("Found:", result.found);
  console.log("File:", result.file);
});

// Main setup function to upload file, get CID, and save metadata
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

  // Save file metadata to MongoDB
  await saveFileMetadata(cid);

  // Return the initial state with just the CID
  const initialState = {
    cid: cid,
    initialized: true,
  };

  console.log("Initial State:", initialState);
  return initialState;
}
