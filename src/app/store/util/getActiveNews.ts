import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {COVER_PHOTO} from "@/shared/consts/defaultNewsCoverPhoto";
import {getComments} from "./getComments";
import { INews } from "@/app/interfaces/news/news";
import { getLikes } from "./getLikes";


export async function getActiveNews() {
    const db = await connectToDatabase();
    const collection = db.collection("news");
    try {

        const activeNews = await collection.find({active: true}).toArray()

        // @ts-ignore
        const newsArray: INews[] = await Promise.all(activeNews.map(async (news) => {
            const comments = await getComments(news._id.toString());
            const likes = await getLikes(news._id.toString());
            return {
                _id: news._id.toString(),
                title: news.title,
                text: news.text,
                coverPhoto: news.coverPhoto !== undefined && news.coverPhoto !== null ? news.coverPhoto : COVER_PHOTO,
                datePublished: news.datePublished,
                active: news.active,
                comments: comments || [],
                likes: likes || []
            };
        }));
        return newsArray;

    } catch (error: any) {
        console.error('Error fetching active news:', error.message);
        return null;
    }
}


