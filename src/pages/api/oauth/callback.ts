import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";

import { web } from "../../../../oauth"
import {baseUrl} from "@/app/config/baseUrl";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    try {
        switch (req.method){
            case "GET":
                const { code, state } = req.query;

                const reqBody = {
                    grant_type: 'authorization_code',
                    code,
                    client_id: web.client_id,
                    client_secret: web.client_secret,
                    redirect_uri: baseUrl + 'oauth/callback'
                }

                // console.log(JSON.stringify(reqBody))

                const request = new Request(web.token_uri,{
                    method: "POST",
                    body: JSON.stringify(reqBody)
                })

                const resp = await fetch(request)

                const token = await resp.json()

                if (token.error)
                    return res.status(400).json({ message: "Callback from google has error."});

                await db.collection('googleAuthTokens').insertOne({
                    user: new ObjectId(state),
                    oauthToken: token
                })

                return res.json({ message: "OAuth saved."})
            default:
                return res.status(400).json({ message: "Method's not allowed."})
        }
    }
    catch (err) {
        console.log('err' , err)
        return res.status(500).json({ message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);