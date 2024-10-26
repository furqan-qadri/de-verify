import { namespaceWrapper, app } from "@_koii/namespace-wrapper";
import { task } from "./1-task.js";
import { submission } from "./2-submission.js";
import { audit } from "./3-audit.js";

export function routes() {
  /**
   * Define all your custom routes here
   */

  // Route to get the currently stored CID (simulating task retrieval)
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

  // Route to simulate submission by retrieving and submitting the CID
  app.post("/submit", async (req, res) => {
    const roundNumber = req.body.roundNumber;
    console.log(`Submitting CID for round ${roundNumber}`);
    const submittedCid = await submission(roundNumber);
    res.status(200).json({ submittedCid });
  });

  // Route to audit a CID submission for a specific round
  app.post("/audit", async (req, res) => {
    const { submission, roundNumber, submitterKey } = req.body;
    console.log(
      `Auditing submission for round ${roundNumber} from submitter ${submitterKey}`,
    );
    const isValid = await audit(submission, roundNumber, submitterKey);
    res.status(200).json({ valid: isValid });
  });
}
