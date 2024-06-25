import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {getActiveNews} from "@/app/store/util/getActiveNews"
import {Main} from "@/app/models/main";

const collectionName = 'main';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        let mainContent = await db.collection(collectionName).findOne()
        if (mainContent !== null) mainContent.newsSection = await getActiveNews();
        return res.json({mainContent})
    } else if (req.method === 'POST') {
        const user = await authCheck(req, res);
        const role = user?.role;
        if (role !== 'curator') return res.status(400).json({message: "You don't have privileges to edit the main page."})

        const main: Main = req.body;
        let existingContent = await db.collection(collectionName).findOne();
        if (existingContent === null) {
            return await db.collection(collectionName).insertOne(main)
                .then((value) => res.json({message: "Success creating main content."}))
                .catch((err) => res.json({message: "DB error", err}))
        }
            return await db.collection(collectionName).replaceOne({_id: existingContent._id}, main)
                .then((value) => res.json({message: "Success editing main content."}))
                .catch((err) => res.json({message: "DB error", err}))

        } else if (req.method === 'PUT') {
            const user = await authCheck(req, res);
            const role = user?.role;
            if (role !== 'curator') return res.status(400).json({message: "You don't have privileges to edit the main page."})

            const main: Main = req.body;
            let existingContent = await db.collection(collectionName).findOne();
            if (existingContent === null) {
                return await db.collection(collectionName).insertOne(main)
                    .then((value) => res.json({message: "Success creating main content."}))
                    .catch((err) => res.json({message: "DB error", err}))
            }
            return await db.collection(collectionName).replaceOne({_id: existingContent._id}, main)
                .then((value) => res.json({message: "Success editing main content."}))
                .catch((err) => res.json({message: "DB error", err}))
        } else if(req.method === 'DELETE') {
        const user = await authCheck(req, res);
        const role = user?.role;
        if (role !== 'curator') return res.status(400).json({message: "You don't have privileges to edit the main page."})
        return res.status(400).json({message:"Main Page content cannot be deleted"})
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
