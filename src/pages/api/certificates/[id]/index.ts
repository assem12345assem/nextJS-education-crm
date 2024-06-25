import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {Certificate} from "@/app/models/docs";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import  {getStudentNameById} from "@/app/store/util/getStudentName"
import  {getClassNameById} from "@/app/store/util/getClassName"
import {getInstructorNameById} from "@/app/store/util/getInstructorName";

const collectionName = "certificates";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const id = req.query.id.toString();
    const user = await authCheck(req, res)
    const role = user?.role;
    try {
        switch (req.method) {
            case "GET": {
                const certificate = await collection.findOne({_id:new ObjectId(id)});
                if(role==='student') {
                    if(certificate?.student !== user?.profile) {
                        res.status(400).json({message: "You do not have access to this certificate."});
                        break;
                    }
                }
                if(role==='mentor') {
                    if(certificate?.instructor !== user?.profile) {
                        res.status(400).json({message: "You do not have access to this certificate."});
                        break;
                    }
                }

                // @ts-ignore
                certificate.student = await getStudentNameById(certificate.student);
                // @ts-ignore
                certificate.class = await getClassNameById(certificate.class)
                // @ts-ignore
                certificate.instructor = await getInstructorNameById(certificate.instructor)

                // @ts-ignore
                res.status(200).json({certificate});
                break;
            }
            case "PUT": {
                if (role === 'student') {
                    res.status(400).json({message: "You are not authorized to edit certificates."})
                    break;
                }
                const certificate: Certificate = req.body;
                await db.collection('certificates').replaceOne({_id: new ObjectId(id)}, certificate)
                res.status(200).json({message: "Success updating certificate.", certificate: certificate})
                break;
            }
            default:
                res.status(405).json({message: "Method Not Allowed"});
        }
    } catch (error) {
        console.error(`Error handling ${req.method} request:`, error);
        res.status(500).json({message: "Internal Server Error"});
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);
