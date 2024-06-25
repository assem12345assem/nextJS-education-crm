import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {createMeeting} from "@/app/libs/googleApi"

const collectionName = 'sessions';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    try {
        switch (req.method) {
            case "GET":
                const allSessions = await db.collection(collectionName).find({groupClass:id}).toArray();
                const filteredSessions = allSessions.map(session => ({
                    _id: session._id,
                    groupClass: session.groupClass,
                    title: session.title
                }));
                return res.status(200).json({filteredSessions})
            case "POST":
                const user = await authCheck(req, res);
                const role = user?.role;
                if (role === 'mentor' || role === 'curator') {
                    let sessionInfo = req.body;
                    const groupClass = req.query.id.toString()

                    //check if mentor teaches this class:
                    if (role === 'mentor') {
                        const thisClass = await db.collection('groupClasses').findOne({_id: new ObjectId(groupClass)})
                        if (thisClass?.mentor.toString() !== user?.profile.toString()) {
                            return res.status(400).json({message: "You do not teach this class."})
                        }
                    }

                    const createVideoLink = {
                        summary: sessionInfo.title,
                        description: sessionInfo.description,
                        start_date: sessionInfo.date,
                        end_date: sessionInfo.date,
                        start_time: sessionInfo.timeStart,
                        end_time: sessionInfo.timeEnd,
                    }
                    // googleAuthTokens currently responds only to cr@cr account.
                    // That is why, passing _id of that user via a temp variable authorizedUser
                    let authorizedUser = {
                        _id: '65df1da2533347d427c9f189'
                    }
                    const link = await createMeeting(authorizedUser, createVideoLink)
                    sessionInfo.groupClass = groupClass;
                    sessionInfo.videoConferenceLink = link.hangoutLink;

                    const newSession = await db.collection(collectionName).insertOne(sessionInfo);
                    return res.status(201).json({message: "Session created successfully.", newSession});
                } else {
                    return res.status(400).json({message: "You are not authorized to create sessions for this class."})
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