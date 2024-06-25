import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {ObjectId} from "mongodb";
import { createOrder } from "@/app/libs/paypal";

const collectionName = 'groupPayments';

// @ts-ignore
const handler = async (req, res) => {

    try {
        const response = await createOrder('1000')

        return res.json({ order: response.result })
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