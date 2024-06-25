import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, Db } from "mongodb";
import {connectToDatabase, dbName, mongoUrl} from "@/app/consts/mongodbUrl";

const collectionName = "users";

export default async function handler(req: NextApiRequest, res: any) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);
  if (req.method === "GET") {
    const users = await collection.find().toArray();
    // @ts-ignore
    res.status(200).json({ users: users });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
