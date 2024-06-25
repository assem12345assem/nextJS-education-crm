import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";
// @ts-ignore
import {Error} from 'node';

/**
 * Get the course name by their ID.
 * @param classId The ID of the group course.
 * @returns The course's name, or null if not found.
 */


export async function getClassNameById(classId: string): Promise<string | null> {
    const db = await connectToDatabase();
    const collection = db.collection("groupClasses");
    const coursesCollection = db.collection("groupCourses")
    try {
        const groupClass = await collection.findOne({_id: new ObjectId(classId)});
        const groupCourse = await coursesCollection.findOne({_id: new ObjectId(groupClass?.groupCourse)})
        if (groupCourse) {
            return groupCourse.topic;
        } else {
            return null;
        }
    } catch (error: Error) {
        console.error('Error fetching group course title:', error.message);
        return null;
    }
}
