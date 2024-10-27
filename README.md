
# Project Title

DeVerify is a defi app which helps organizations (or other persons) verify the authenticity and the immutability of the various documents like (files, photos, documents etc) which they received from someone else.

The app has been deployed on KOII.

There are two entities:

1. Uploader: Person who uploads his original files like IDs, certs etc for verification by others.

2. Verifier: Person who needs to verify the document which has been sent to him. He/she wants to make sure that the file is original and its content has not been changed.



Here is how it works in simple words:

1. Uploader uploads his original files to the KOII network using the upload feature of DeVerify.

2. The file is uploaded and a CID (Content identifier) is generated. This is specific to the content of the file. Even the slightest of changes in the file, will lead to a different CID. 

3. To make performance better and to reduce round trips to the blockchain, the CID is logged to a lightweight MongoDB cluster.

4. Now, the verifier uploads the same document to De-Verify which he received from someone and wants to check if its still contains original content. 

4. Once the verifier uploads the documents, if the content is the same as the original the CID would be the same as was generated in step 2 which means the doc is verified. (De-verify will use the MongoDB logging to check for this)

5. If the CID of the doc has changed, it means that the content was modified and the verification would fail. 









## Screenshots and Walkthrough


Please check the PITCH DECK: https://www.canva.com/design/DAGUwofxBI0/YoWap62fPKKOIMBw0QTZGg/edit?utm_content=DAGUwofxBI0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
