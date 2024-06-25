import {ObjectId} from "mongodb";

export type Session = {
    groupClass: string, //foreign key ObjectId
    title: string,
    description: string,
    date: string, //2020-01-20
    timeStart: string,
    timeEnd: string,
    attendance: string[], //foreign key to Students
    lessonFiles: string[],
    homework: {
        description: string,
        deadline: string
    },
    videoConferenceLink: string
}

export type HomeworkSubmitted = {
    student: string, //foreign key ObjectId
    session: string, // foreign key ObjectId
    homework: string[],
    grade: string, //a number or Letter
    feedback: string
}