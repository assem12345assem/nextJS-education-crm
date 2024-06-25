import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {formatDate} from "@/app/store/util/formatDate"
import {ObjectId} from "mongodb";
import {getComments} from "@/app/store/util/getComments";
import {IComment} from "@/app/interfaces/news/news";

const collectionName = 'comments';
// @ts-ignore
const handler = async (req, res) => {
        const db = await connectToDatabase();

        if (req.method === 'GET') {
            const newsId = req.body.news;
            let comments = await getComments(newsId);
            return res.json({comments})
        } else if (req.method === 'POST') {
            const user = await authCheck(req, res);
            if (!user) return res.status(403).json({message: "Please login to like or comment the post."})
            const comment: Comment = req.body;
            // @ts-ignore
            comment.date = formatDate(new Date())
            // @ts-ignore
            comment.user = user._id.toString()
            return await db.collection(collectionName).insertOne(comment)
                .then((value) => res.status(201).json({message: "Success registering the comment."}))
                .catch((err) => res.status(500).json({message: "DB error", err}))
        } else if (req.method === 'PUT') {
            const user = await authCheck(req, res);
            if (!user) return res.status(403).json({message: "Please login to like or comment the post."})
            const comment: IComment = req.body;
            // @ts-ignore
            const existingComment: IComment = await db.collection(collectionName).findOne({
                _id: new ObjectId(comment._id)
            });
            if(existingComment !== null) {
                if (user.role === 'curator' || existingComment.user.toString() === user._id.toString()) {
                    return await db.collection(collectionName).updateOne({_id: new ObjectId(comment._id)},{$set: {text:comment.text}} )
                        .then(() => res.status(200).json({message: "Success editing the comment"}))
                        .catch((err) => {
                            console.error("DB error:", err);
                            res.status(500).json({message: "DB error"});
                        })
                }
                return res.status(400).json({message: "You cannot edit this comment"})
            } else {
                return res.status(400).json({message: "Comment was not found."})
            }

        } else if (req.method === 'DELETE') {
            const user = await authCheck(req, res);
            if (!user) return res.status(403).json({message: "Please login to modify your like or comment."})
            const commentId = req.body._id;
            const existingComment = await db.collection(collectionName).findOne({
                _id:new ObjectId(commentId)
            });
            if (existingComment !== null ) {
                // @ts-ignore
                if(user.role === 'curator' || user._id.toString() === existingComment.user.toString()) {
                    return await db.collection(collectionName).deleteOne({_id: new ObjectId(commentId)})
                        .then((value) => res.status(200).json({message: "Success deleting comment."}))
                        .catch((err) => res.status(500).json({message: "Error deleting comment", err}))
                } else {
                    return res.status(400).json({message: "You are not authorized to delete this comment."})
                }
            } else {
                return res.status(400).json({message: "Comment was not found."})

            }
        }
    }
;

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);