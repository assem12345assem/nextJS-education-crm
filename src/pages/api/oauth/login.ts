import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";

import { web } from "../../../../oauth"
import {baseUrl} from "@/app/config/baseUrl";
import authCheck from "@/app/libs/authCheck";

const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created','https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar'];

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {
        switch (req.method){
            case "POST":
                const user = await authCheck(req, res)

                if (!user)
                    return res.status(400).json({ message: "Log in first."})

                const googleAuth = await db.collection('googleAuthTokens').findOne({ user: user?._id })

                if (googleAuth)
                    return res.json({ message: "Already authenticated."})

                const authEndpoint = web.auth_uri;

                const queryParams = new URLSearchParams({
                    response_type: 'code',
                    client_id: web.client_id,
                    redirect_uri: baseUrl + 'oauth/callback',
                    scope: SCOPES.join(" "),
                    access_type: 'offline',
                    state: user?._id.toString()
                })

                const authUrl = `${authEndpoint}?${queryParams}`

                return res.redirect(authUrl)
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