import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {baseUrl} from "@/app/config/baseUrl";
import {web} from "../../../../oauth";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import {createMeeting, refresh} from "@/app/libs/googleApi";

const collectionName = 'googleAuthTokens';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    try {
        switch (req.method) {
            case "POST":
                const user = await authCheck(req, res);

                await createMeeting(user, {
                    summary: 'Sds',
                    description: 'Sdas',
                    start_date: '2024-02-10',
                    end_date: '2024-02-10',
                    start_time: '01:10:00',
                    end_time: '01:10:00'
                })
                    .then((resp: any) => {
                        return res.json({ message: "Success creating meeting.", link: resp.hangoutLink })
                    })
                    .catch(() => {
                        return res.status(400).json({ message: "You need to login as google account." })
                    })

            break;
            default:
                return res.status(400).json({message: "Method's not allowed."})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);