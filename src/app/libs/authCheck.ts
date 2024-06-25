import {verify} from "jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";
import {connectToDatabase} from "@/app/consts/mongodbUrl";

export default async function authCheck(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectToDatabase();
    const auth = req.headers.authorization || req.body.authorization
    const token = verify(auth, 'your-secret-key')

    if (!token)
        return res.status(400).json({message: "Bad token."})

    // @ts-ignore
    const user = await db.collection('users').findOne({token: auth})
    return user;
}