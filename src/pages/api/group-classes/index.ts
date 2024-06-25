import Cors from "micro-cors";
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import { GroupClass } from "@/app/models/group-models";
import { ObjectId } from "mongodb";

const collectionName = "groupClasses";

// @ts-ignore
const handler = async (req, res) => {
  const db = await connectToDatabase();

  if (req.method === "GET") {
    const groupClasses = await db.collection(collectionName).find().toArray();

    const populateGroupCoursePromises = groupClasses.map(async (groupClass) => {
      groupClass.groupCourse = await db
        .collection("groupCourses")
        .findOne({ _id: new ObjectId(groupClass.groupCourse) });
      return groupClass;
    });
    const populatedGroupClasses = await Promise.all(
      populateGroupCoursePromises
    );

    return res.json({ groupClasses: populatedGroupClasses });
  } else if (req.method === "POST") {
    const user = await authCheck(req, res);
    const role = user?.role;

    if (role === "curator") {
      const groupClass: GroupClass = req.body;
      return await db
        .collection(collectionName)
        .insertOne(groupClass)
        .then((value) =>
          res.json({
            message: "Success creating group class.",
            groupClass: { ...groupClass, _id: value.insertedId },
          })
        )
        .catch((err) => res.json({ message: "DB error", err }));
    } else {
      return res.status(400).json({ message: "You don't have privileges." });
    }
  } else {
    return res.status(400).json({ message: "Method's not allowed." });
  }
};

const cors = Cors({
  origin: "*",
  // @ts-ignore
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);
