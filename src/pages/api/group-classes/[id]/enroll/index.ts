import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {GroupRequest} from "@/app/models/enroll";


const collectionName = 'groupRequests';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    try {
        switch (req.method){
            case "GET": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role === 'curator') {
                    const groupRequests = await db.collection(collectionName).find({ groupClass: new ObjectId(id)}).toArray()

                    const final = await Promise.all(groupRequests.map(async (request) => {
                        const student = await db.collection('students').findOne({ _id: request.student })
                        return { ...request, student }
                    }))

                    return res.json({ groupRequests: final })
                }
                else if (role === 'student') {
                    const groupRequests = await db.collection(collectionName).find({ student: user?.profile, groupClass: new ObjectId(id) }).toArray()
                    return res.json({ groupRequests })
                }
                else
                    return res.status(400).json({ message: "Method is not allowed."})

            }
            case "POST": {
                const user = await authCheck(req, res);
                const role = user?.role;

                if (role !== 'student')
                    return res.status(400).json({message: "You cannot enroll in course."})

                const profileId = user?.profile;
                const profile = await db.collection('students').findOne({_id: new ObjectId(profileId)})

                if (!profile)
                    return res.status(400).json({message: "Create profile first."})

                const id = req.query.id;

                const groupClass = await db.collection('groupClasses').findOne({ _id: new ObjectId(id) })

                if (!groupClass)
                    return res.status(400).json({ message: "Group class not found."})

                const date_finish = groupClass.finish_date;
///TODO
                const finish = new Date(date_finish);
                const now = new Date();

                console.log("finsih " , finish)
                console.log("now ", now)

                if( now > finish )
                    return res.status(400).json({ message: "Class is closed."})
////TILL HERE
                const check = await db.collection(collectionName).findOne({ groupClass: new ObjectId(id), student: new ObjectId(profile._id)})

                if (check)
                    return res.status(400).json({ message: "Request already created."})

                const request: GroupRequest = {
                    groupClass: new ObjectId(id),
                    student: new ObjectId(profile._id),
                    status: "pending" //pending, accepted, declined - variants of state
                }

                await db.collection(collectionName).insertOne(request)

                return res.json({message: "Request sent."})
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