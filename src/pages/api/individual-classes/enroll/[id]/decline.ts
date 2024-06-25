import Cors from "micro-cors";
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import { ObjectId } from "mongodb";

const collectionName = "individualRequests";
//   @ts-ignore
const handler = async (req, res) => {
  const db = await connectToDatabase();

  const id = req.query.id;

  try {
    const user = await authCheck(req, res);
    const role = user?.role;

    if (req.method === "POST" && role === "curator") {
      const request = await db
        .collection(collectionName)

        .findOne({ _id: new ObjectId(id) });

      if (!request) {
        return res.status(404).json({ message: "Request not found." });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Cannot decline request with status other than 'pending'.",
        });
      }

      await db
        .collection(collectionName)

        .updateOne({ _id: new ObjectId(id) }, { $set: { status: "declined" } });

      return res.json({ message: "Success declining request. Successs" });
    } else {
      return res
        .status(400)
        .json({ message: "Method not allowed or user role is invalid." });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

const cors = Cors({
  origin: "*", // You might want to specify a more restricted origin
  //   @ts-ignore
  methods: ["GET", "POST"], // Allow only GET and POST methods
});

export default cors(handler);
