export type Certificate={
    student: string,
    class: string,
    instructor: string,
    digitalSignature: string,
    digitalStamp: string,
    additionalInfo: string,
    dateIssued: string
}

export type RecommendationLetter ={
    student: string,
    instructor: string,
    class: string,
    digitalSignature: string,
    digitalStamp: string,
    text: string,
    dateIssued: string
}
export type RecommendationRequest = {
    student: string,
    instructor: string,
    class: string,
    status: "pending" | "approved" | "declined",
    letterId: string,
    comments: string,
    dateCreated: string,
    dateLastUpdate: string
}
/**
Docs contains models for certificates, receipts, recommendation letters.

Certificate:
    -   student: student id,
    -   class: class id,
    -   instructor: instructor id,
    -   digitalSignature: To do - insert default signature or replace with custom img
    -   digitalStamp: insert default signature or replace with custom img
    -   additionalInfo: [optional field] student's grade, course start-end dates
    -   dateIssued: date when certificate was issued.
 */