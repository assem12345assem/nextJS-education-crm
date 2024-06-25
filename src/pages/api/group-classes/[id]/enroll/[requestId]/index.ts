import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'groupRequests';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const id = req.query.id;

    try {
        const user = await authCheck(req, res);
        const role = user?.role;

        if (role !== 'curator')
            return res.status(400).json({ message: "You have no privileges."})

        const id = req.query.requestId;

        switch (req.method){
            case "GET":
                const request = await db.collection(collectionName).findOne({ _id: new ObjectId(id) })
                return res.json({ request })
            default:
                return res.status(400).json({ message: "Method's not allowed."})
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);