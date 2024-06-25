import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {InstructorProfile} from "@/app/models/profiles";

const collectionName = 'instructors';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    try {
        switch (req.method){
            case "GET":
                const mentor = await db.collection(collectionName).findOne({ _id: new ObjectId(id)})
                return res.json({ mentor })
            case "PUT": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role === 'curator') {
                    const profile: InstructorProfile = req.body;
                    const edited = await db.collection(collectionName)
                        .findOneAndUpdate({_id: new ObjectId(id)}, {...profile}, {returnDocument: "after"})
                    return res.json({mentorProfile: edited})
                } else
                    return res.status(400).json({message: "You don't have privileges."})
            }
            case "DELETE": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role === 'curator') {
                    await db.collection(collectionName).deleteOne({_id: id})
                    return res.json({message: "Deleted Mentor profile."})
                } else
                    return res.status(400).json({message: "You don't have privileges."})
            }
            default:
                return res.status(400).json({ message: "Method's not allowed."})
        }
    }
    catch (err) {
        return res.status(500).json({ message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);