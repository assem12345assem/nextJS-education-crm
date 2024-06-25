import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {GroupCourse} from "@/app/models/group-models";
import authCheck from "@/app/libs/authCheck";

const collectionName = "groupCourses";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        const courses = await db.collection('groupCourses').find().toArray()

        return res.json({ groupCourses: courses })
    }
    else if (req.method === 'POST') {
        const user = await authCheck(req, res);
        const role = user?.role;
        if (role === 'curator') {
            const groupCourse: GroupCourse = req.body;
            await db.collection(collectionName).insertOne(groupCourse)
            return res.json({message: "Success creating group course.", groupCourse: groupCourse})
        }
        else {
            return res.status(400).json({ message: "You don't have privileges."})
        }
    }
    else {
        return res.status(400).json({ message: "Method is not allowed."})
    }


};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);