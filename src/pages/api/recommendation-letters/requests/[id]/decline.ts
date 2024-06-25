import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {RecommendationLetter} from "@/app/models/recommendations";

const collectionName = 'recommendationRequests';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const requestId = req.query.id;

    try {
        switch (req.method){
            case "POST":
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role !== 'mentor') {
                    return res.status(400).json({ message: "Restrict, only mentor can decline rec. requests."})
                }

                const request = await db.collection(collectionName).findOne({_id: new Object(requestId)})

                if (!request)
                    return res.status(400).json({message: "Can't find recommendation request."})

                await db.collection(collectionName).updateOne({ _id: request._id }, { $set: { status: 'declined' }} )

                return res.json({message: "Success sending recommendation letter."})

            default:
                return res.status(400).json({ message: "Method's not allowed."})
        }
    }
    catch (err) {
        return res.status(500).json({ message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);