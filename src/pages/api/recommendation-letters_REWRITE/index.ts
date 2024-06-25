import {connectToDatabase} from "@/app/consts/mongodbUrl";
import Cors from "micro-cors";
import authCheck from "@/app/libs/authCheck";
import {IRecommendationLetters} from "@/app/interfaces/docs/recommendationLetter";
import {getRecommendationLetter} from "@/app/store/util/getRecommendationLetter";
import {ObjectId} from "mongodb";
import {formatDate} from '@/app/store/util/formatDate'
import {SIGNATURE, STAMP} from "@/shared/consts/certificateElems";

const collectionName = "recommendationLetters";
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const user = await authCheck(req, res);
    const role = user?.role;

    try {
        switch (req.method) {
            case "GET":
                let recommendationLetters: IRecommendationLetters;
                let result;
                if (role === 'student' || role === 'mentor') {
                    result = await db.collection(collectionName).find({student: new ObjectId(user?.profile)}).toArray();
                }
                result = await db.collection(collectionName).find().toArray();

                // @ts-ignore
                const promises = await result.map(async letter => await getRecommendationLetter(letter));
                const letters = await Promise.all(promises);

                recommendationLetters = {
                    recommendationLetters: letters
                };

                return res.status(200).json(recommendationLetters)
                break;
            case "POST":
                if (role === 'student') {
                    return res.status(400).json({message: "You are not authorized to post recommendation letters."})
                }
                const letter = req.body;
                if (letter.text === null) {
                    return res.status(400).json({message: "Please insert letter text"})
                }
                letter.dateIssued = formatDate(new Date())
                letter.digitalSignature = req.body.digitalSignature !== null ? req.body.digitalSignature : SIGNATURE
                letter.digitalStamp = req.body.digitalStamp !== null ? req.body.digitalStamp : STAMP
                const letterInserted = await db.collection(collectionName).insertOne(letter);
                const letterId = letterInserted.insertedId.toString();
                const studentRequest = await db.collection('recommendationRequests').findOne({student: letter.student, class: letter.class, instructor: letter.instructor, status: 'pending'})
                await db.collection('recommendationRequests').updateOne({_id: new ObjectId(studentRequest?._id)}, {$set: {status: 'approved', letterId: letterId}})
                return res.status(201).json({message: "Recommendation letter was saved successfully"})
                break;
            case "PUT":
                if (role === 'student') {
                    return res.status(400).json({message: "You are not authorized to post recommendation letters."})
                }
                const updatedLetter = req.body;
                const existingLtr = await db.collection(collectionName).find({_id: new ObjectId(updatedLetter._id)})
                if (existingLtr === null) return res.status(400).json({message: "The recommendation letter was not found"})
                 await db.collection(collectionName).replaceOne({_id: new ObjectId(updatedLetter._id)}, updatedLetter)
                return res.status(200).json({message: "Recommendation letter was updated successfully"})
                break;
            case "DELETE":
                const id = req.body._id;
                const item = await db.collection(collectionName).findOne({_id: new ObjectId(id)})
                if (item === null) return res.status(400).json({message: "Recommendation letter could not be found."})
                if (role === 'student') {
                    if (item.student.toString() !== user?.profile.toString()) return res.status(400).json({message: "You are not authorized to delete this request"})
                }
                 await db.collection(collectionName).deleteOne({_id: new ObjectId(id)})
                const studentRqst = await db.collection('recommendationRequests').findOne({student: item.student, class: item.class, instructor: item.instructor, status: 'approved'})
                await db.collection('recommendationRequests').updateOne({_id: new ObjectId(studentRqst?._id)}, {$set: {letterId: 'letter was deleted'}})
                return res.status(200).json({message: "Recommendation letter was deleted successfully"})
                break;
            default:
                return res.status(400).json({message: "Method's not allowed."})
        }
    } catch (err) {
        return res.status(500).json({message: "Server Error", err})

    }
}

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);