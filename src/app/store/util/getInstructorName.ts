import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";
// @ts-ignore
import { Error } from 'node';
/**
 * Get the instructor's name by their ID.
 * @param instructorId The ID of the instructor.
 * @returns The instructor's name, or null if not found.
 */


export async function getInstructorNameById(instructorId: string): Promise<string | null> {
    const db = await connectToDatabase();
    const collection = db.collection("instructors");
    try {
        const instructorProfile = await collection.findOne({_id:new ObjectId(instructorId)});
        if (instructorProfile) {
            return instructorProfile.fullName;
        } else {
            return null;
        }
    } catch (error:Error) {
        console.error('Error fetching instructor profile:', error.message);
        return null;
    }
}
