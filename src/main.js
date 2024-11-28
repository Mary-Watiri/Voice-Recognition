import { HfInference } from '@huggingface/inference';
import AppwriteService from './appwrite.js';

export default async ({ req, res, log, error }) => {
  const databaseId = process.env.APPWRITE_DATABASE_ID ?? 'ai';
  const collectionId = process.env.APPWRITE_COLLECTION_ID ?? 'speech_recognition';
  const bucketId = process.env.APPWRITE_BUCKET_ID ?? 'speech_recognition';

  let fileId = req.body.$id || req.body.fileId;

  if (!fileId) {
    return res.text('Bad request', 400);
  }

  if (
    req.body.bucketId &&
    req.body.bucketId != bucketId
  ) {
    return res.text('Bad request', 400);
  }

  const appwrite = new AppwriteService();

  const file = await appwrite.getFile(bucketId, fileId);

  const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

  const result = await hf.automaticSpeechRecognition({
    data: file,
    model: 'openai/whisper-large-v3',
  });

  await appwrite.createRecognitionEntry(databaseId, collectionId, fileId, result.text);

  log('Audio ' + fileId + ' recognised', result.text);
  return res.json({ text: result.text });
};
