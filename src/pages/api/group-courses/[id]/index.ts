import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {GroupCourse} from "@/app/models/group-models";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'groupCourses';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const id = req.query.id.toString();

    const user = await authCheck(req, res);
    const role = user?.role;

    if (req.method === 'GET') {
        const gC = await db.collection(collectionName).findOne({_id: new ObjectId(id)})
        return res.json({groupCourse: gC})
    }
    else if (req.method === 'PUT') {
        if (role === 'curator') {
            const groupCourse: GroupCourse = req.body;
            const updated = await db.collection(collectionName)
                .findOneAndUpdate({_id: new ObjectId(id)}, {$set: {...groupCourse}}, {returnDocument: "after"})

            return res.json({ message: "Success editing group course.", groupCourse: updated })
        }
        else {
            return res.status(400).json({ message: "You don't have privileges."})
        }
    }
    else if (req.method === 'DELETE') {
        if (role === 'curator') {
            return await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) })
                .then(() => res.json({ message: `Success deleting group course. ID - ${id}`}))
                .catch((err) => res.status(500).json({ message: "DB error", err}))
        }
        else {
            return res.status(400).json({ message: "You don't have privileges."})
        }
    }
    else {
        return res.status(400).json({ message: "Method's not allowed."})
    }

}

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);
