import {connectToDatabase} from "@/app/consts/mongodbUrl";
import Cors from "micro-cors";
import authCheck from "@/app/libs/authCheck";
import {IRecommendationRequests} from "@/app/interfaces/docs/recommendationLetter";
import {ObjectId} from "mongodb";
import {getRecommendationRequests} from "@/app/store/util/getRecommendationRequests";
import {formatDate} from '@/app/store/util/formatDate'

const collectionName = "recommendationRequests";
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const user = await authCheck(req, res);
    const role = user?.role;

    try {
        switch (req.method) {
            case "GET":
                let recommendationRequests: IRecommendationRequests;
                let result;
                if (role === 'student' || role === 'mentor') {
                    result = await db.collection(collectionName).find({student: new ObjectId(user?.profile)}).toArray();
                }
                result = await db.collection(collectionName).find().toArray();

                // @ts-ignore
                const promises = await result.map(async request => await getRecommendationRequests(request));
                const rqst = await Promise.all(promises);

                recommendationRequests = {
                    recommendationRequests: rqst
                };

                return res.status(200).json(recommendationRequests)
                break;
            case "POST":
                const request = req.body;

                if (role === 'student') {
                    request.student = user?.profile
                }
                if (request.instructor === null) {
                    return res.status(400).json({message: "Please include the name of instructor."})
                }
                if (request.class === null) {
                    return res.status(400).json({message: "Please include the name of class."})
                }
                if (request.student === null) {
                    return res.status(400).json({message: "Please include the name of student."})
                }
                request.status = "pending"
                request.letterId = null
                request.dateCreated = formatDate(new Date())
                request.dateLastUpdate = formatDate(new Date())

                 await db.collection(collectionName).insertOne(request);
                return res.status(201).json({message:"Request was registered successfully."})
                break;
            case "PUT":
                const updatedRequest = req.body;
                const existingRequest = await db.collection(collectionName).findOne({_id: updatedRequest._id})
                if(role === 'student') {
                    if(updatedRequest.student.toString() !== existingRequest?.student.toString()) return res.status(400).json({message:"You are not authorized to edit this request"})
                }
                updatedRequest.student = updatedRequest.student !== null ? updatedRequest.student : existingRequest?.student
                updatedRequest.instructor = updatedRequest.instructor !== null ? updatedRequest.instructor : existingRequest?.instructor
                updatedRequest.class = updatedRequest.class !== null ? updatedRequest.class : existingRequest?.class
                updatedRequest.dateCreated = existingRequest?.dateCreated
                updatedRequest.dateLastUpdate = formatDate(new Date())
                updatedRequest.comments = updatedRequest.comments !== null ? updatedRequest.comments : existingRequest?.comments
                 await db.collection(collectionName).replaceOne({_id:new ObjectId(updatedRequest._id)}, updatedRequest)
                return res.status(201).json({message:"Request was updated successfully."})
                break;
            case "DELETE":
                const id = req.body._id;
                const item = await db.collection(collectionName).findOne({_id:new ObjectId(id)})
                if(item === null) return res.status(400).json({message:"The request was not found"})
                if(role === 'student') {
                    if(item.student.toString() !== user?.profile.toString()) return res.status(400).json({message:"You are not authorized to delete this request"})
                }
                 await db.collection(collectionName).deleteOne({_id: new ObjectId(id)})
                return res.status(201).json({message:"Request was deleted successfully."})
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