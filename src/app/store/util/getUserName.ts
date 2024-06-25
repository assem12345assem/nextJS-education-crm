import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {getStudentNameById} from './getStudentName'
import {getInstructorNameById} from './getInstructorName'
// @ts-ignore
import {Error} from 'node';
import { ObjectId } from "mongodb";

export async function getUserName(id: string) {
    const db = await connectToDatabase();
    const userCollection = db.collection("users")
    const studentCollection = db.collection("students")
    const instructorCollection = db.collection("instructors")
    try {
        const user = await userCollection.findOne({_id:new ObjectId(id)})
        // @ts-ignore
        const profileId = user.profile
        console.log(profileId)
        // @ts-ignore
        if (user.role === 'student') {
            return getStudentNameById(profileId)
        } else {
            // @ts-ignore
            if (user.role === 'mentor') {
                return getInstructorNameById(profileId)
            } else {
                return "Admin";
            }
        }

    } catch (error: Error) {
        console.error('Error fetching user name:', error.message);
        return null;
    }
}
