import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'recommendationLetters';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {
        const user = await authCheck(req, res);
        const role = user?.role;

        switch (req.method){
            case "GET":
                if ( role !== 'student')
                    return res.status(400).json({ message: "Method's not allowed."})

                const profile = user?.profile;

                if (!profile)
                    return res.status(400).json({ message: "Create profile first."})

                const recommendationLetters = await db.collection(collectionName).find({ student: profile }).toArray()

                return res.json( recommendationLetters )
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