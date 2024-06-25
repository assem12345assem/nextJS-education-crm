import {connectToDatabase} from "@/app/consts/mongodbUrl";
import { IComment } from "@/app/interfaces/news/news";
import { ObjectId } from "mongodb";
// @ts-ignore
import {Error} from 'node';
import { getUserName } from "./getUserName";

export async function getComments(id:string): Promise<IComment[] | null> {
    const db = await connectToDatabase();

    try {
        const comments  = await db.collection("comments").find({news: id}).toArray();
        if(comments !== null && comments !== undefined) {
            for (const c of comments) {
                c.user = await getUserName(c.user.toString())
            }
        }
        // @ts-ignore
        return comments
    } catch (error: Error) {
        console.error('Error fetching comments:', error.message);
        return null;
    }
}
