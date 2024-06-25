import {connectToDatabase} from "@/app/consts/mongodbUrl";
import { IRecommendationLetter } from "@/app/interfaces/docs/recommendationLetter";
import {ObjectId} from "mongodb";
// @ts-ignore
import { Error } from 'node';
import { getStudentNameById } from "./getStudentName";
import { getInstructorNameById } from "./getInstructorName";
import { getClassNameById } from "./getClassName";
import { SIGNATURE, STAMP } from "@/shared/consts/certificateElems";
import {formatDate} from './formatDate'



export async function getRecommendationLetter(recommendationLetter: IRecommendationLetter): Promise<IRecommendationLetter | null> {
    const db = await connectToDatabase();

    const student = await getStudentNameById(recommendationLetter.student)
    const instructor = await getInstructorNameById(recommendationLetter.instructor)
    const className  = await getClassNameById(recommendationLetter.class)
    try {

        const letter=  {
            _id: recommendationLetter._id,
            student: student !== null ? student : recommendationLetter.student,
            instructor: instructor !== null ? instructor : recommendationLetter.instructor,
            class: className !== null ? className : recommendationLetter.class,
            classId: recommendationLetter.class,
            digitalSignature: recommendationLetter.digitalSignature !== null ? recommendationLetter.digitalSignature : SIGNATURE,
            digitalStamp: recommendationLetter.digitalStamp !== null ? recommendationLetter.digitalStamp : STAMP,
            text: recommendationLetter.text,
            dateIssued: recommendationLetter.dateIssued !== null ? recommendationLetter.dateIssued : formatDate(new Date()),
        }
        // @ts-ignore
        return letter;
    } catch (error:Error) {
        console.error('Error fetching recommendation letter details:', error.message);
        return null;
    }
}
