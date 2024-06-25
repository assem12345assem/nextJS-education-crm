import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import {PaymentRequest} from "@/app/models/enroll";

const collectionName = 'groupRequests';

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();


    try {

        const user = await authCheck(req, res);
        const role = user?.role;

        if (role !== 'curator')
            return res.status(400).json({ message: "You don't have privileges."})

        const id = req.query.requestId;

        switch (req.method){
            case "POST":
                const status = 'accepted';

                const doc = await db.collection(collectionName).findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { status } }, { returnDocument: "after"})

                const isReq = await db.collection('groupPayments').findOne({ groupRequest: new ObjectId(id)})

                if (isReq)
                    return res.status(400).json({ message: "Already accepted.", paymentRequest: isReq})

                const paymentRequest: PaymentRequest = {
                    groupRequest: new ObjectId(id),
                    student: new ObjectId(doc?.student),
                    status: "pending",
                    proof: null,
                }

                await db.collection('groupPayments').insertOne(paymentRequest)
                return res.json({ message: "Success accepting request."})
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