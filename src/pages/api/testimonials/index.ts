import Cors from "micro-cors";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {Testimonial} from "@/app/models/testimonial";
import {ObjectId} from "mongodb";
import {formatDate} from"@/app/store/util/formatDate";

const collectionName = 'testimonials';

// @ts-ignore
const handler = async (req, res) => {

    const db = await connectToDatabase();

    switch (req.method) {
        case 'POST': {
            const user = await authCheck(req, res);
            const role = user?.role;
            const profile = user?.profile;

            if (role !== 'student')
                return res.status(400).json({message: "You cannot apply testimonials."})

            if (!profile)
                return res.status(400).json({message: "Create profile first."})

            const groupClass = await db.collection('groupClasses').findOne({_id: new ObjectId(req.body.groupClass)})

            if (!groupClass?.students.some((studentId: { equals: (arg0: any) => any; }) => studentId.equals(profile)))
                return res.status(400).json({message: "You are not enrolled in this class."})

            const testimonial: Testimonial = req.body;
            // @ts-ignore
            testimonial.groupClass = new ObjectId(testimonial.groupClass)
            // @ts-ignore
            testimonial.student = new ObjectId(profile.toString())
            testimonial.date = formatDate(new Date())
            return await db.collection(collectionName).insertOne(testimonial)
                .then((value) => res.json({message: 'Success adding testimonials.', testimonial: value}))
                .catch((err) => res.status(500).json({message: "DB error.", err}))
        }
        case 'GET': {

            const user = await authCheck(req, res);
            const role = user?.role;

            if (role === 'curator') {
                const testimonials = await db.collection(collectionName).find().toArray();

                return res.json({testimonials})
            } else {
                return res.status(400).json({message: "You don't have privileges."})
            }

        }
        default:
            return res.status(400).json({message: "Method's not allowed."})
    }
};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);