import { Db, MongoClient } from "mongodb";

export const mongoUrl =
  "//";
export const dbName = "education-crm";

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if(cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(mongoUrl, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = client.db(dbName);

  return cachedDb;
}

