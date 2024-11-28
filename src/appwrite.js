import { Client, Databases, ID, Storage } from 'node-appwrite';

class AppwriteService {
  constructor() {
      const client = new Client();
      client
        .setEndpoint(
          process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1'
        )
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

      this.databases = new Databases(client);
      this.storage = new Storage(client);
  }

  async createRecognitionEntry(databaseId, collectionId, audioId, speech) {
    await this.databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        audio: audioId,
        speech: speech,
      }
    );
  }

  async getFile(bucketId, fileId) {
    return await this.storage.getFileDownload(bucketId, fileId);
  }
}

export default AppwriteService;
