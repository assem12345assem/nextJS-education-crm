import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {getActiveNews} from "@/app/store/util/getActiveNews"
import {Main} from "@/app/models/main";
import { News } from "@/app/models/news";
import {formatDate} from "@/app/store/util/formatDate"
import { INews } from "@/app/interfaces/news/news";
import { ObjectId } from "mongodb";

const collectionName = 'news';
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        let news= await getActiveNews();
        return res.json({news})
    } else if (req.method === 'POST') {
        const user = await authCheck(req, res);
        const role = user?.role;
        if (role === 'student' || role === 'mentor') return res.status(400).json({message: "You don't have privileges to edit the news."})
        const news: News = req.body;
        news.datePublished = formatDate(new Date())
        return await db.collection(collectionName).insertOne(news)
                .then((value) => res.status(201).json({message: "Success creating news entry."}))
                .catch((err) => res.status(500).json({message: "DB error", err}))
    } else if (req.method === 'PUT') {
        const user = await authCheck(req, res);
        const role = user?.role;
        if (role === 'student' || role === 'mentor') return res.status(400).json({message: "You don't have privileges to edit the news."})

        const news: INews = req.body;
        news.datePublished = formatDate(new Date());
        let existingContent = await db.collection(collectionName).findOne({_id:new ObjectId(news._id)});
        if (existingContent !== null) {
            return await db.collection(collectionName).replaceOne({_id:existingContent._id}, news)
                .then((value) => res.status(200).json({message: "Success editing news entry content."}))
                .catch((err) => res.status(500).json({message: "DB error", err}))
        }
        return res.status(400).json({message:"The news entry is not found. Please create a new entry or verify _id"});
    } else if(req.method === 'DELETE') {
        const user = await authCheck(req, res);
        const role = user?.role;
        if (role === 'student' || role === 'mentor') return res.status(400).json({message: "You don't have privileges to edit the news."})
        return await db.collection(collectionName).deleteOne({_id:new ObjectId(req.body._id)})
            .then((value) => res.status(200).json({message: "Success deleting news entry."}))
            .catch((err) => res.status(500).json({ message: "Error deleting the news entry", err }))

    }else {
        return res.status(400).json({message: "Method's not allowed."})
    }
};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);