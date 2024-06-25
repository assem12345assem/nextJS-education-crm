import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {RecommendationLetter, RecommendationRequest} from "@/app/models/recommendations";

const collectionName = 'recommendationRequests';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {

        const user = await authCheck(req, res);
        const role = user?.role;

        switch (req.method) {
            case "GET":
                switch (role) {
                    case 'mentor': {
                        if (!user?.profile)
                            return res.status(400).json({message: "Create profile first."})

                        const recommendationRequests = await db.collection(collectionName).find({mentor: user?.profile}).toArray()

                        return res.json({recommendationRequests})
                    }
                    case 'student': {
                        if (!user?.profile)
                            return res.status(400).json({message: "Create profile first."})

                        const recommendationRequests = await db.collection(collectionName).find({student: user?.profile}).toArray()

                        return res.json({recommendationRequests})
                    }
                    case 'curator':
                        const recommendationRequests = await db.collection(collectionName).find({}).toArray()
                        return res.json({recommendationRequests})
                    default:
                        return res.status(400).json({message: "Method is not allowed."})
                }
            case "DELETE": {
                switch(role) {
                    case 'mentor':

                    default:
                        return res.status(400).json({message: "Method is not allowed."})
                }
            }
            case "POST":
                switch (role) {
                    case 'student':
                        //REQUEST FOR LETTER

                        if (!user?.profile)
                            return res.status(400).json({message: "Create profile first."})

                        //we only need "mentor id" from front end
                        const recommendationRequest: RecommendationRequest = {
                            mentor: req.body.mentor,
                            student: user?.profile,
                            status: 'pending'
                        }

                        await db.collection(collectionName).insertOne(recommendationRequest)

                        return res.json({message: "Success sending request."})
                    default:
                        return res.status(400).json({message: "Method is not allowed."})
                }
            default:
                return res.status(400).json({message: "Method's not allowed."})
        }
    } catch (err) {
        return res.status(500).json({message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);