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
        switch (req.method){
            case "GET": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role === 'curator') {
                    const groupRequests = await db.collection(collectionName).find().toArray()

                    const final = await Promise.all(groupRequests.map(async (request) => {
                        const student = await db.collection('students').findOne({ _id: request.student })
                        return { ...request, student }
                    }))

                    return res.json({ groupRequests: final })
                }
                else if (role === 'student') {
                    const groupRequests = await db.collection(collectionName).find({ student: user?.profile }).toArray()
                    return res.json({ groupRequests })
                }
                else
                    return res.status(400).json({ message: "Method is not allowed."})

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