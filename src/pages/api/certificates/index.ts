import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {Certificate} from "@/app/models/docs";
// @ts-ignore
import {STAMP, SIGNATURE} from "@/shared/consts/certificateElems"
import {formatDate} from "@/app/store/util/formatDate"
import  {getStudentNameById} from "@/app/store/util/getStudentName"
import  {getClassNameById} from "@/app/store/util/getClassName"
import  {getInstructorNameById} from "@/app/store/util/getInstructorName"

import {ObjectId} from "mongodb";

let todayDate = formatDate(new Date())

const collectionName = "certificates";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const user = await authCheck(req, res);
    const role = user?.role;
    try {
        switch (req.method) {
            case "GET": {
                let certificates;
                if(role === 'student') {
                    const profileId = user?.profile;
                    const studentCollection = db.collection("students");
                    const student = await studentCollection.findOne({_id:new ObjectId(profileId)});
                    certificates = await collection.find({student:new ObjectId(student?._id)}).toArray();
                } else if(role === 'instructor') {
                    const profileId = user?.profile;
                    const instructorCollection = db.collection("instructors");
                    const instructor = await instructorCollection.findOne({_id:new ObjectId(profileId)});
                    certificates = await collection.find({instructor:new ObjectId(instructor?._id)}).toArray();

                } else {
                    certificates = await collection.find().toArray();
                }
                if(certificates !== null && certificates !== undefined) {
                    for (const certificate of certificates) {
                        certificate.student = await getStudentNameById(certificate.student);
                        certificate.class = await getClassNameById(certificate.class);
                        certificate.instructor = await getInstructorNameById(certificate.instructor)
                    }
                }
                // @ts-ignore
                res.status(200).json({certificates});
                break;
            }
            case "POST": {
                if (role === 'student') {
                    res.status(403).json({message: "You are not authorized to edit certificates."})
                    break;
                }
                const newCertificate: Certificate = {
                    student: req.body.student,
                    class: req.body.class,
                    instructor: req.body.instructor,
                    digitalSignature: req.body.digitalSignature !== undefined && req.body.digitalSignature !== null ? req.body.digitalSignature : SIGNATURE,
                    digitalStamp: req.body.digitalStamp !== undefined && req.body.digitalStamp !== null ? req.body.digitalStamp : STAMP,
                    additionalInfo: req.body.additionalInfo !== undefined && req.body.additionalInfo !== null ? req.body.additionalInfo : null,
                    dateIssued: req.body.dateIssued !== undefined && req.body.dateIssued !== null ? req.body.dateIssued : todayDate
                };

                await collection.insertOne(newCertificate);
                res.status(201).json({message: "Certificate added successfully."});
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
