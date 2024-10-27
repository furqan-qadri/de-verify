import { namespaceWrapper, app } from "@_koii/namespace-wrapper";
import multer from "multer";
import fs from "fs";
import { KoiiStorageClient } from "@_koii/storage-task-sdk";
import { Keypair } from "@_koii/web3.js";
import { File } from "./0-setup.js";

// Initialize Koii Storage Client and Keypair
const client = new KoiiStorageClient();
const walletPath =
  "/Users/furqanqadri/Library/Application Support/KOII-Desktop-Node/namespace/furqan_stakingWallet.json";
const wallet = fs.readFileSync(walletPath, "utf-8");
const userStaking = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(wallet)));

// Configure multer for handling file uploads (temporarily in 'uploads' folder)
const upload = multer({ dest: "/tmp" });

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path; // Path of the uploaded file in 'uploads' folder
    const fileName = req.file.originalname; // Original file name
    const uploader = req.body.uploader || "anonymous"; // Optional uploader information from request

    // Upload the file to Koii and get the CID
    const fileUploadResponse = await client.uploadFile(filePath, userStaking);
    const cid = fileUploadResponse.cid;

    console.log("File uploaded successfully. CID:", cid);

    // Save metadata to MongoDB
    const fileRecord = new File({
      cid,
      fileName,
      uploader,
      uploadDate: new Date(),
    });
    const savedFile = await fileRecord.save();
    console.log("File metadata saved to MongoDB:", savedFile);

    // Remove the file from the temporary uploads directory
    fs.unlinkSync(filePath);

    // Respond with success and CID
    res.status(200).json({ message: "File uploaded successfully", cid });
  } catch (error) {
    console.error("File upload error:", error);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});

export function routes() {
  /**
   * Define all your custom routes here
   */

  // Route to get the currently stored CID
  app.get("/get-cid", async (_req, res) => {
    const cid = await namespaceWrapper.storeGet("documentCid");
    console.log("Retrieved CID:", cid);
    res.status(200).json({ cid });
  });

  // Route to manually trigger the task (for testing purposes)
  app.post("/task", async (req, res) => {
    const roundNumber = req.body.roundNumber;
    console.log(`Manually triggering task for round ${roundNumber}`);
    await task(roundNumber);
    res.status(200).json({ message: "Task executed" });
  });

  // Route to submit CID
  app.post("/submit", async (req, res) => {
    const roundNumber = req.body.roundNumber;
    console.log(`Submitting CID for round ${roundNumber}`);
    const submittedCid = await submission(roundNumber);
    res.status(200).json({ submittedCid });
  });

  // Route to audit a CID submission
  app.post("/audit", async (req, res) => {
    const { submission, roundNumber, submitterKey } = req.body;
    console.log(
      `Auditing submission for round ${roundNumber} from submitter ${submitterKey}`,
    );
    const isValid = await audit(submission, roundNumber, submitterKey);
    res.status(200).json({ valid: isValid });
  });
}
