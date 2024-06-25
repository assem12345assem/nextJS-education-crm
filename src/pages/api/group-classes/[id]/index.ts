import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {GroupClass} from "@/app/models/group-models";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'groupClasses';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const id = req.query.id.toString();

    if (req.method === 'GET') {
        const gC = await db.collection(collectionName).findOne({_id: new ObjectId(id)})

        if (!gC)
            return res.status(404).json({message: "Group class not found."})

        const groupCourse = await db.collection('groupCourses').findOne({_id: new ObjectId(gC.groupCourse)});

        //READ! "$in" operator -> https://www.mongodb.com/docs/manual/reference/operator/query/in/
        const students = await db.collection('students').find({_id: {$in: gC.students}}).toArray()

        const sessions = await db.collection('sessions').find({groupClass: gC._id}).toArray()
        const testimonials = await db.collection('testimonials').find({groupClass: gC._id}).toArray()
        const likes = await db.collection('groupLikes').find({groupClass: gC._id}).toArray()
        const numberOfLikes = likes.length;
        const final = {
            ...gC,
            groupCourse,
            sessions,
            students,
            testimonials,
            numberOfLikes,
            likes
        }

        return res.json({groupClass: final})
    } else if (req.method === 'PUT') {

        const user = await authCheck(req, res);
        const role = user?.role;

        if (role === 'curator') {
            const groupClass: GroupClass = req.body;
            const updated = await db.collection(collectionName)
                .findOneAndUpdate({_id: new ObjectId(id)}, {$set: {...groupClass}}, {returnDocument: "after"})

            return res.json({message: "Success editing group class", groupClass: updated})
        } else {
            return res.status(400).json({message: "You don't have privileges."})
        }
    } else if (req.method === 'DELETE') {

        const user = await authCheck(req, res);
        const role = user?.role;

        if (role === 'curator') {
            return await db.collection(collectionName).deleteOne({_id: new ObjectId(id)})
                .then(() => res.json({message: `Success deleting group class. ID - ${id}`}))
                .catch((err) => res.status(500).json({message: "DB error", err}))
        } else {
            return res.status(400).json({message: "You don't have privileges."})
        }
    } else {
        return res.status(400).json({message: "Method's not allowed."})
    }

}

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);
