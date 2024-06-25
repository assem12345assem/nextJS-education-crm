import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ILike} from "@/app/interfaces/news/news";
import {ObjectId} from "mongodb";
// @ts-ignore
import {Error} from 'node';
import { getUserName } from "./getUserName";

export async function getLikes(id: string): Promise<ILike[] | null> {
    const db = await connectToDatabase();
    const collection = db.collection("likes");
    try {
        // @ts-ignore
        const likes:ILike[] = await collection.find({news: id}).toArray();
        if(likes !== null && likes !== undefined) {
            for (const l of likes) {
                // @ts-ignore
                l.user = await getUserName(l.user.toString())
            }
        }
        return likes;
    } catch (error: Error) {
        console.error('Error fetching likes:', error.message);
        return null;
    }
}
