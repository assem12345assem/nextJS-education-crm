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

    if (role !== 'curator')
        return res.status(400).json({ message: "You don't have privileges."})

    try {
        switch (req.method){
            case "POST":
                const payment = await db.collection(collectionName).findOne({ _id: new ObjectId(id)})

                if (!payment)
                    return res.status(404).json({ message: "No payment request."})

                if (payment.status === 'pending' || payment.status === 'declined')
                    return res.status(400).json({ message: "Can't accept payment, proof is not loaded."})

                if (payment.status === 'accepted')
                    return res.status(400).json({ message: "Already accepted."})

                await db.collection(collectionName).updateOne({ _id: new ObjectId(id)}, { $set: { status: "accepted" }})

                //add student to class

                const groupRequest = await db.collection('groupRequests').findOne({ _id: new ObjectId(payment?.groupRequest)})

                await db.collection('groupClasses').findOneAndUpdate({ _id: new ObjectId(groupRequest?.groupClass)}, { $push: { students: payment?.student }})

                return res.json({ message: "Success accepting payment."})
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