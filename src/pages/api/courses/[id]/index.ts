import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, Db, ObjectId } from "mongodb";
import {connectToDatabase, dbName, mongoUrl} from "@/app/consts/mongodbUrl";
import { GroupCourse } from "@/app/models/group-models";
const collectionName = "groupCourses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GroupCourse[] | GroupCourse | { message: string }>
) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);

  try {
    switch (req.method) {
      case "GET": {
        if (req.query.id) {
          const courseId = req.query.id.toString();
          const course = await collection.findOne({
            _id: new ObjectId(courseId),
          });
          if (course) {
            // @ts-ignore
            res.status(200).json({ courseData: course });
          } else {
            res.status(404).json({ message: "Course not found" });
          }
        } else {
          const courses = await collection.find().toArray();
          // @ts-ignore
          res.status(200).json({ courses });
        }
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
