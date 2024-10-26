import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function audit(submission, roundNumber, submitterKey) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);

  try {
    // Retrieve the stored mock CID from namespace storage
    const storedCid = await namespaceWrapper.storeGet("documentCid");

    // Compare the stored CID with the submission
    const isValid = submission === storedCid;
    console.log(
      "Audit result:",
      isValid ? "Valid submission" : "Invalid submission",
    );

    return isValid;
  } catch (error) {
    console.error("AUDIT ERROR:", error);
    return false;
  }
}
