import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function submission(roundNumber) {
  /**
   * Submit the task proofs for auditing
   * Must return a string of max 512 bytes to be submitted on chain
   */
  try {
    console.log(`MAKE SUBMISSION FOR ROUND ${roundNumber}`);

    // Retrieve the mocked CID stored in the task function
    const cid = await namespaceWrapper.storeGet("documentCid");

    // Log and return the CID as the submission proof for auditing
    console.log("Submitting CID as proof:", cid);
    return cid;
  } catch (error) {
    console.error("MAKE SUBMISSION ERROR:", error);
  }
}
