import Cors from "micro-cors";
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";

const collectionName = 'testimonials';


// READ! This endpoint is probably not needed


// @ts-ignore
const handler = async (req, res) => {

    const db = await connectToDatabase();

    switch (req.method) {
        case 'GET':
            const id = req.query.id;
            const testimonials = await db.collection(collectionName).find({ groupClass: new ObjectId(id) }).toArray();

            return res.json({ testimonials })
        default:
            return res.status(400).json({ message: "Method's not allowed."})
    }
};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);