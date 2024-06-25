import Cors from "micro-cors";
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import { ObjectId } from "mongodb";
import { IndividualRequest } from "@/app/models/enroll";

const collectionName = "individualRequests";

// @ts-ignore
const handler = async (req, res) => {
  const db = await connectToDatabase();

  try {
    const user = await authCheck(req, res);
    const role = user?.role;

    switch (req.method) {
      case "GET": {
        if (role === "curator") {
          const individualRequests = await db
            .collection(collectionName)
            .find({})
            .toArray();
          return res.json({ individualRequests });
        } else if (role === "student") {
          const profile = user?.profile;

          const individualRequests = await db
            .collection(collectionName)
            .find({ student: profile })
            .toArray();
          return res.json({ individualRequests });
        } else
          return res.status(400).json({ message: "Method is not allowed." });
      }
      case "POST": {
        if (role !== "student")
          return res.status(400).json({ message: "Method is not allowed." });

        const profile = user?.profile;
        if (!profile)
          return res.status(400).json({ message: "Create profile first." });

        const request: IndividualRequest = req.body;
        request.student = profile;
        request.status = "pending";

        const sent = await db.collection(collectionName).insertOne(request);

        return res.json({
          message: "Successfully sent request.",
          individualRequest: sent,
        });
      }
      default:
        return res.status(400).json({ message: "Method's not allowed." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server Error", err });
  }
};

const cors = Cors({
  origin: "*", // You might want to specify a more
  // @ts-ignore
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);
