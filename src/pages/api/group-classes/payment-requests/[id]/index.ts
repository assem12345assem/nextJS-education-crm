import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";

const collectionName = 'groupPayments';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();

    const id = req.query.id;

    const user = await authCheck(req, res);
    const role = user?.role;


    try {
        switch (req.method){
            case "GET":
                if (role === 'curator') {
                    const request = await db.collection(collectionName).findOne({ _id: new ObjectId(id)})
                    return res.json({ paymentRequest: request })
                }
                else if (role === 'student') {
                    const paymentRequest = await db.collection(collectionName).findOne({ _id: new ObjectId(id)})


                    if ( paymentRequest?.student.toString() !== user?.profile.toString() )
                        return res.status(400).json({ message: "You don't have privileges."})

                    return res.json({ paymentRequest })
                }

                return res.status(400).json({ message: "You don't have privileges."})

            case "POST":
                if (role === 'student') {
                    const {proof} = req.body;

                    const payment = await db.collection(collectionName).findOne({ _id: new ObjectId(id)})

                    switch (payment?.status) {
                        case 'submitted':
                            return res.json({ message: "You have already submitted payment proof."})
                        case 'accepted':
                            return res.json({ message: "Payment proof is already accepted."})
                    }

                    await db.collection(collectionName).updateOne({ _id: new ObjectId(id)}, { $set: { proof, status: 'submitted' } })

                    return res.json({ message: "Success sending payment proof."})
                }

                return res.status(400).json({ message: "Method's not allowed."})
            default:
                return res.status(400).json({ message: "Method's not allowed."})
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error", err})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);