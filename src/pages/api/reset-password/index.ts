import {connectToDatabase} from "@/app/consts/mongodbUrl";
import Cors from "micro-cors";
import {hash} from "bcrypt";
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {
        if (req.method === "POST") {
            const usersCollection = db.collection("users");
            const {password, username} = await req.body
            const existingUser = await usersCollection.findOne({username});
            if (!existingUser) {
                return res
                    .status(422)
                    .json({message: "User with this username does not exist."});
            }
            const hashedPassword = await hash(password, 10);

            try {
                await usersCollection.updateOne({_id: existingUser._id}, {
                    $set: {
                        password: hashedPassword, resetToken: undefined, resetTokenExpiration: undefined
                    }
                })
                return res.status(200).json({message: "Your password has been reset."})
            } catch (err: any) {
                return res.status(500).json({message: err})
            }

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