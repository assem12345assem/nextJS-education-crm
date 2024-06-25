import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'groupClasses';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {
        const user = await authCheck(req, res);
        const role = user?.role;

        switch (req.method){
            case "GET":

                //TODO: add mentors classes
                if (role === 'student')
                {
                    const groupClasses = await db.collection(collectionName).find({
                        students: { $elemMatch: { $eq: user?.profile }}
                    }).toArray()

                    return res.json({ groupClasses })
                }
                else
                    return res.status(400).json({ message: "Method's not allowed."})

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