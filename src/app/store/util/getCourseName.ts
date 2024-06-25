import { GroupCourse } from '@/app/models/group-models'; // Import the StudentProfile type
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";
// @ts-ignore
import { Error } from 'node';
/**
 * Get the course name by their ID.
 * @param courseId The ID of the group course.
 * @returns The course's name, or null if not found.
 */


export async function getCourseNameById(courseId: string): Promise<string | null> {
    const db = await connectToDatabase();
    const collection = db.collection("groupCourses");

    try {
        const groupCourse = await collection.findOne({_id:new ObjectId(courseId)});

        if (groupCourse) {
            return groupCourse.topic;
        } else {
            return null;
        }
    } catch (error:Error) {
        console.error('Error fetching group course title:', error.message);
        return null;
    }
}
