import { connectToDatabase } from "@/app/consts/mongodbUrl";
import { IRecommendationRequest } from "@/app/interfaces/docs/recommendationLetter";
import { getStudentNameById } from "./getStudentName";
import { getInstructorNameById } from "./getInstructorName";
import { getClassNameById } from "./getClassName";
// @ts-ignore
import { Error } from 'node';

// @ts-ignore
export async function getRecommendationRequests(request:IRecommendationRequest) : Promise<IRecommendationRequest | null> {
    const db = await connectToDatabase();
    const student = await getStudentNameById(request.student)
    const instructor = await getInstructorNameById(request.instructor)
    const className  = await getClassNameById(request.class)
    try {

        const rqst=  {
            _id: request._id,
            student: student !== null ? student : request.student,
            instructor: instructor !== null ? instructor : request.instructor,
            class: className !== null ? className : request.class,
            classId: request.class,
            status: request.status,
            letterId: request.letterId !== null ? request.letterId : null,
            comments: request.comments,
            dateCreated: request.dateCreated,
            dateLastUpdate: request.dateLastUpdate
        }
        // @ts-ignore
        return rqst;
    } catch (error:Error) {
        console.error('Error fetching recommendation request details:', error.message);
        return null;
    }
}