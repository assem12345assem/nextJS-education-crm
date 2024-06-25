import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {serializeWithBufferAndIndex} from "bson";

const collectionName = 'groupPayments';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    try {
        switch (req.method){
            case "GET":
                const user = await authCheck(req, res);
                const role = user?.role;

                switch (role) {
                    case "curator":
                        const groupPaymentRequests = await db.collection(collectionName).find().toArray()

                        return res.json({ groupPaymentRequests })
                    case "student":
                        const profile = user?.profile;

                        if (!profile)
                            return res.status(400).json({ message: "Method's not allowed."})

                        const paymentRequests = await db.collection(collectionName).find({ student: profile }).toArray();

                        return res.json({ paymentRequests })
                    default:
                        return res.status(400).json({ message: "Method's not allowed."})
                }
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