import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'groupPayments';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    const user = await authCheck(req, res);
    const role = user?.role;

    if (role !== 'curator')
        return res.status(400).json({ message: "You don't have privileges."})

    try {
        switch (req.method){
            case "POST":
                const doc = await db.collection(collectionName).findOne({ _id: new ObjectId(id) })

                if (doc?.status === 'pending')
                    return res.status(400).json({ message: "Request is not fulfilled."})

                else if (doc?.status === 'declined')
                    return res.status(400).json({ message: "Request already declined."})

                else if (doc?.status === 'accepted')
                    return res.status(400).json({ message: "Request already accepted."})

                await db.collection(collectionName).updateOne({ _id: new ObjectId(id)}, { $set: { status: "declined", proof: null }})
                return res.json({ message: "Success declining payment."})
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