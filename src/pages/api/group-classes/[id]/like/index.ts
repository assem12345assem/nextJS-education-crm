import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ClassLike} from "@/app/models/testimonial";
import {ObjectId} from "mongodb";
import {formatDate} from "@/app/store/util/formatDate";

const collectionName = 'groupLikes';

// @ts-ignore
const handler = async (req, res) => {

    const db = await connectToDatabase();

    switch (req.method) {
        case 'POST': {
            const user = await authCheck(req, res);
            const role = user?.role;
            const profile = user?.profile;

            if (role !== 'student')
                return res.status(400).json({message: "You cannot like classes."})

            if (!profile)
                return res.status(400).json({message: "Create profile first."})

            const id = req.query.id;

            const groupClass = await db.collection('groupClasses').findOne({_id: new ObjectId(id)})

            if (!groupClass?.students.some((studentId: { equals: (arg0: any) => any; }) => studentId.equals(profile)))
                return res.status(400).json({message: "You are not enrolled in this class."})
            const existingLike = await db.collection(collectionName).findOne({
                groupClass: groupClass._id,
                student: new ObjectId(profile.toString())
            })
            if (existingLike !== null) {
                return res.status(400).json({message: "You have already liked this class"})
            }
            let classLike: ClassLike = ({
                // @ts-ignore
                groupClass: groupClass._id,
                // @ts-ignore
                student: new ObjectId(profile.toString()),
                date: formatDate(new Date())
            });

            return await db.collection(collectionName).insertOne(classLike)
                .then((value) => res.status(201).json({
                    message: 'Success adding a like for this class.',
                    classLike: value
                }))
                .catch((err) => res.status(500).json({message: "DB error.", err}))
            break;
        }
        case 'GET': {
//classLikes availbale to everyone?
            const user = await authCheck(req, res);
            const role = user?.role;

            const classLikes = await db.collection(collectionName).find().toArray();
            return res.status(200).json({classLikes})

            break;
        }
        case 'DELETE': {
            const user = await authCheck(req, res);
            const role = user?.role;
            const profile = user?.profile;

            if (role !== 'student')
                return res.status(400).json({message: "You cannot like or unlike classes."})

            if (!profile)
                return res.status(400).json({message: "Create profile first."})

            const id = req.query.id;

            const groupClass = await db.collection('groupClasses').findOne({_id: new ObjectId(id)})

            const existingLike = await db.collection(collectionName).findOne({
                groupClass: groupClass?._id,
                student: new ObjectId(profile.toString())
            })
            if (existingLike === null) {
                return res.status(400).json({message: "You have not liked this class yet"})
            }


            return await db.collection(collectionName).deleteOne(existingLike)
                .then((value) => res.status(201).json({
                    message: 'Success deleting your like.'
                }))
                .catch((err) => res.status(500).json({message: "DB error.", err}))
            break;
        }
        default:
            return res.status(400).json({message: "Method's not allowed."})
            break;
    }
};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);