import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {StudentProfile} from "@/app/models/profiles";
import {IStudent} from "@/app/interfaces/user/profile";

const collectionName = 'students';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    try {
        switch (req.method){
            case "GET":
                const students = await db.collection(collectionName).find({}).toArray()

                return res.json({ students })
            case "POST": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role === 'curator') {
                    const profile: StudentProfile = req.body.profile;
                    const userId = req.body.id;

                    const userTarget = await db.collection(collectionName).findOne({_id: userId})

                    if (userTarget?.profile)
                        return res.status(400).json({message: "User has profile. Won't create new"})

                    const result = await db.collection(collectionName).insertOne(profile)

                    await db.collection('users').updateOne({_id: userId}, {profile: new ObjectId(result.insertedId)})

                    return res.json({message: "Successfully created Student profile."});
                } else
                    return res.status(400).json({message: "You don't have privileges."})
            }
            case "PUT": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role === 'curator') {
                    const profile: StudentProfile = req.body.profile;
                    const userId = req.body.id;

                    const userTarget = await db.collection(collectionName).findOne({_id: userId})

                    if(!userTarget)
                        return res.status(400).json({ message: "Can't find user."})

                    if (!userTarget.profile)
                        return res.status(400).json({message: "User has profile. Won't create new"})

                    const profileId = userTarget.profile;

                    await db.collection(collectionName).findOneAndUpdate({ _id: profileId }, { ...profile }, {returnDocument:"after"})

                    return res.json({message: "Successfully edited Student profile."});
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