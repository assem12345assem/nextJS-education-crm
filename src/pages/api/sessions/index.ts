import Cors from "micro-cors";
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {Session} from "@/app/models/sessions";
import { ObjectId } from "mongodb";


const collectionName = "sessions";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const user = await authCheck(req,res);
    const role = user?.role;
    if(!user) return res.status(403).json({message:"Please login first."})

    switch (req.method) {
        case "GET": {
            if (role === 'curator') {
                const allSessions = await db.collection(collectionName).find().toArray();
                return res.status(200).json({allSessions})
                break;
            }
            else if (role === 'mentor') {
                const mentorClasses = await db.collection('groupClasses').find({mentor:user.profile.toString()}).toArray();
                const mentorSessions = [];
                for (const mentorClass of mentorClasses) {
                    const sessionsForMentorClass = await db.collection(collectionName).find({ groupClass: mentorClass._id.toString() }).toArray();
                    mentorSessions.push({
                        mentorClass,
                        sessions: sessionsForMentorClass
                    });
                }
                return res.status(200).json({mentorSessions})
            } else if(role === 'student') {

                const studentClasses = await db.collection('groupClasses').find({students: new ObjectId(user.profile.toString())}).toArray();
                const studentSessions = []
                for (const studentClass of studentClasses) {
                    const sessionsForStudentClass = await db.collection(collectionName).find({groupClass: studentClass._id.toString()}).toArray();
                    studentSessions.push({
                        studentClass,
                        sessions: sessionsForStudentClass
                    });
                }
                return res.status(200).json({studentSessions})
            }
            else
                return res.status(400).json({ message: "You don't have privileges." })
        }
        default:
            return res.status(400).json({ message: "Method is not allowed."})
    }

};

const cors = Cors({
  origin: "*", // You might want to specify a more
  // @ts-ignore
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);