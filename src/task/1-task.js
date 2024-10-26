import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { setup } from "./0-setup.js"; // Import the setup function to access the mock CID

export async function task(roundNumber) {
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);

    // Run the setup function to get the initial state, including the mocked CID
    const { cid } = await setup(); // Extract the mock CID from the setup function

    // Store the mocked CID in KOII's namespace storage for later use in the submission function
    await namespaceWrapper.storeSet("documentCid", cid);
    console.log("Mocked CID stored for task:", cid);

    // Optionally, you can return the CID for debugging purposes
    return cid;
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}
