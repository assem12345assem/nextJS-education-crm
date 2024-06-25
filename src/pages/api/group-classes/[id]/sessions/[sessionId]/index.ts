import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";


const collectionName = "sessions";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const user = await authCheck(req, res);
    const role = user?.role;
    if (!user) return res.status(403).json({message: "Please login first."})

    const groupClassId = req.query.id.toString();
    const groupClass = await db.collection('groupClasses').findOne({_id: new ObjectId(groupClassId)})
    const sessionId = req.query.sessionId.toString();
    const session = await db.collection(collectionName).findOne({_id: new ObjectId(sessionId)})

    if (role === 'mentor') {
        if (groupClass?.mentor.toString() !== user.profile.toString()) {
            return res.status(400).json({message: "You do not have access to this session."})
        }
    }

    if (role === 'student') {
        if (!groupClass?.students.includes(new ObjectId(user.profile.toString()))) {
            return res.status(400).json({message: "You do not have access to this session."})
        }
    }
    switch (req.method) {
        case "GET": {
            return res.status(200).json({session})
        }
        case "PUT": {
            if (role === 'student') {
                return res.status(400).json({message: "You do not have privileges to edit this session."})
            }
            const session = req.body;
            const {
                groupClass,
                title,
                description,
                date,
                timeStart,
                timeEnd,
                attendance,
                lessonFiles,
                homework,
                videoConferenceLink
            } = session;

            const updateObject = {
                $set: {
                    groupClass,
                    title,
                    description,
                    date,
                    timeStart,
                    timeEnd,
                    attendance,
                    lessonFiles,
                    homework,
                    videoConferenceLink
                }
            };
            await db.collection(collectionName).updateOne({_id: new ObjectId(sessionId)}, updateObject)
            return res.status(200).json({message: "Session updated successfully."});
        }
        case "DELETE":{
            if (role === 'student') {
                return res.status(400).json({message: "You do not have privileges to edit this session."})
            }
            await db.collection(collectionName).deleteOne({_id:new ObjectId(sessionId)})
            return res.status(200).json({message:"Session was deleted successfully"})
        }
        default:
            return res.status(400).json({message: "Method is not allowed."})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);