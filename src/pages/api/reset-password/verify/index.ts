import {connectToDatabase} from "@/app/consts/mongodbUrl";
import Cors from "micro-cors";
import crypto from "crypto";
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {
        if (req.method === "POST") {
            const {token} = req.body
            const usersCollection = db.collection("users");
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

            const x = Date.now()
            const user = await usersCollection.findOne({
                resetToken: hashedToken,
                resetTokenExpiration: {$gt: x}
            })

            if (!user) {
                return res.status(400).json({message: "Invalid or expired token."})
            }

            return res.status(200).json(user.username)

        } else {
            res.status(405).json({message: "Method Not Allowed"});
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

const cors = Cors({
    origin: "*",
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);