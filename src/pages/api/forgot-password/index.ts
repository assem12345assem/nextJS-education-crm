// SIGN-UP
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import Cors from "micro-cors";
import crypto from "crypto";
import {basicUrl} from "@/app/config/baseUrl"
import {transporter} from "@/app/libs/nodeMailer"
// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    try {
        if (req.method === "POST") {
            const {username} = req.body;

            const usersCollection = db.collection("users");
            const existingUser = await usersCollection.findOne({username});
            if (!existingUser) {
                return res
                    .status(422)
                    .json({message: "User with this email does not exist."});
            }
            const resetToken = crypto.randomBytes(20).toString('hex');
            const passwordResetToken = crypto.createHash("sha256")
                .update(resetToken)
                .digest("hex");

            const passwordResetExpires = Date.now() + 360000;

            const resetUrl = `${basicUrl}reset-password/${resetToken}`

            const body = "Reset your password by clicking on the following link: " + resetUrl;

            const msg = {
                to: username,
                from: "noreply.rapidamic@gmail.com",
                subject: "Reset Password",
                text: body
            }
            const sendMail = async (msg: any) => {
                try {
                    await transporter.sendMail(msg);

                } catch (error) {
                    throw new Error("Failed to send email. Please try again.");
                }
            }
            try {
                await usersCollection.updateOne({_id: existingUser._id}, {
                    $set: {
                        resetToken: passwordResetToken,
                        resetTokenExpiration: passwordResetExpires
                    }
                });
                await sendMail(msg);
                return res.status(200).json({message: "Reset password link was sent to your email address."});
            } catch (error: any) {
                if (existingUser) {
                    await usersCollection.updateOne({_id: existingUser._id}, {
                        $set: {
                            resetToken: undefined,
                            resetTokenExpiration: undefined
                        }
                    });
                }
                return res.status(500).json({message: "Failed to reset password. Please try again."});
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