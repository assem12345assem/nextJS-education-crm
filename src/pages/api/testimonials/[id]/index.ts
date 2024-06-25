import Cors from "micro-cors";
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import { Testimonial } from "@/app/models/testimonial";

const collectionName = 'testimonials'

// @ts-ignore
const handler = async (req, res) => {

    const db = await connectToDatabase();

    switch (req.method) {
        case 'DELETE':
        {
            const user = await authCheck(req, res);
            const role = user?.role;
            const id = req.query.id;

            if ( role === 'curator' ){
                return await db.collection(collectionName).deleteOne({ _id: id })
                    .then(() => res.json({ message: "Success deleting testimonial."}) )
                    .catch((err) => res.status(500).json({ message: "DB error.", err }))
            }
            else {
                return res.status(400).json({ message: "You don't have privileges."})
            }

        }
        default:
            return res.status(400).json({ message: "Method's not allowed."})
    }
};

const cors = Cors({
  origin: "*", // You might want to specify a more
  // @ts-ignore
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);