import {ObjectId} from "mongodb";

export type RecommendationRequest = {
    student: ObjectId, //owner of request
    mentor: ObjectId //foreign key to mentor
    status: string // pending, done, declined
}

export type RecommendationLetter = {
    student: ObjectId,
    mentor: ObjectId,
    title: string,
    text: string,
}