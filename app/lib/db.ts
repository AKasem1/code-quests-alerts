import { MongoClient, type Collection, type Document } from "mongodb";

const dbName = "code-quests";

let cachedClient: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error("MONGO_URL environment variable is not set");

  if (!cachedClient) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      cachedClient = client;
    } catch (err) {
      await client.close().catch(() => {});
      throw err;
    }
  }

  return cachedClient;
}

export async function getCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<T>> {
  const client = await getClient();
  return client.db(dbName).collection<T>(collectionName);
}
