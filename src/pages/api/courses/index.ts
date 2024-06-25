import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, Db } from "mongodb";
import { connectToDatabase, dbName, mongoUrl } from "@/app/consts/mongodbUrl";
import { GroupCourse } from "@/app/models/group-models";

const collectionName = "groupCourses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GroupCourse[] | { message: string }>
) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);

  try {
    switch (req.method) {
      case "GET": {
        const courses = await collection.find().toArray();
        // @ts-ignore
        res.status(200).json({ courses });
        break;
      }
      case "POST": {
        const newCourse: GroupCourse = req.body;
        await collection.insertOne(newCourse);
        res.status(201).json({ message: "Course added successfully." });
        break;
      }
      default:
        res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(`Error handling ${req.method} request:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
