import { StudentProfile } from '@/app/models/profiles'; // Import the StudentProfile type
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";
// @ts-ignore
import { Error } from 'node';
/**
 * Get the student's name by their ID.
 * @param studentId The ID of the student.
 * @returns The student's name, or null if not found.
 */


export async function getStudentNameById(studentId: string): Promise<string | null> {
    const db = await connectToDatabase();
    const collection = db.collection("students");

    try {
        const studentProfile = await collection.findOne({_id:new ObjectId(studentId)});

        if (studentProfile) {
            return studentProfile.englishName;
        } else {
            return null;
        }
    } catch (error:Error) {
        console.error('Error fetching student profile:', error.message);
        return null;
    }
}
