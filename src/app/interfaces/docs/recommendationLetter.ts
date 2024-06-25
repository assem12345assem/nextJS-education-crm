export interface IRecommendationLetter {
    _id: string,
    student: string,
    instructor: string,
    class: string,
    classId: string,
    digitalSignature: string,
    digitalStamp: string,
    text: string,
    dateIssued: string
}
export interface IRecommendationLetter {
    recommendationLetter: IRecommendationLetter
}
export interface IRecommendationLetters {
    recommendationLetters: IRecommendationLetter[] | any;
}

export interface IRecommendationRequest  {
    _id: string,
    student: string,
    instructor: string,
    class: string,
    classId: string,
    status: "pending" | "approved" | "declined",
    letterId: string,
    comments: string,
    dateCreated: string,
    dateLastUpdate: string
}
export interface IRecommendationRequest {
    recommendationRequest: IRecommendationRequest
}
export interface IRecommendationRequests {
    recommendationRequests: IRecommendationRequest[] | any;
}