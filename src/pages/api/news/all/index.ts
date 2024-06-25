import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";

const collectionName = 'news';
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        const user = await authCheck(req, res);
        if (user?.role === 'curator') {
            let news = await db.collection(collectionName).find().toArray();
            return res.json({news})
        }
        return res.status(400).json({message:"You are not authorized to view all news."})
    } else {
        return res.status(400).json({message: "Method's not allowed."})
    }
};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);