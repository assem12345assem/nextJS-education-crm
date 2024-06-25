import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {Like} from "@/app/models/news";
import {formatDate} from "@/app/store/util/formatDate"
import {ObjectId} from "mongodb";
import {getLikes} from "@/app/store/util/getLikes";

const collectionName = 'likes';
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        const newsId = req.body.news;
        let likes = await getLikes(newsId);
        return res.json({likes})
    } else if (req.method === 'POST') {
        const user = await authCheck(req, res);
        if (!user) return res.status(403).json({message: "Please login to like or comment the post."})
        const like: Like = req.body;
        like.date = formatDate(new Date())
        like.user = user._id.toString()
        const existingLike = await db.collection(collectionName).findOne({
            news: req.body._id,
            user: new ObjectId(user._id)
        });
        if (existingLike === null) {
            return await db.collection(collectionName).insertOne(like)
                .then((value) => res.status(201).json({message: "Success registering the like."}))
                .catch((err) => res.status(500).json({message: "DB error", err}))
        }
        return res.status(400).json({message: "You have already liked this post"});
    } else if (req.method === 'PUT') {
        return res.status(400).json({message: "The method is not allowed."});
    } else if (req.method === 'DELETE') {
        const user = await authCheck(req, res);
        if (!user) return res.status(403).json({message: "Please login to modify your like or comment."})
        const newsId = req.body._id;
        const existingLike = db.collection(collectionName).findOne({
            news: new ObjectId(newsId),
            user: user._id.toString()
        });
        if (existingLike !== null || user.role === 'curator') {
            // @ts-ignore
            return await db.collection(collectionName).deleteOne({_id: new ObjectId(existingLike._id)})
                .then((value) => res.status(200).json({message: "Success deleting like."}))
                .catch((err) => res.status(500).json({message: "Error deleting like", err}))

        }
        return res.status(400).json({message: "You did not like this post yet."})
    }
};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);