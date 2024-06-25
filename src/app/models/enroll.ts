import {ObjectId} from "mongodb";

export type GroupRequest = {
    groupClass: ObjectId //foreign key ObjectId,
    student: ObjectId //foreign key ObjectId,
    status: string, //pending, accepted, declined - state variants
}

export type PaymentRequest = {
    groupRequest: ObjectId, //foreign key ObjectId
    student: ObjectId, //foreign key ObjectId
    status: string, //pending, submitted, accepted, declined - state variants
    proof: string | null, //link to photo proof
}

export type IndividualRequest = {
    student: ObjectId,
    title: string,
    description: string,
    status: string, //accepted, declined, pending
}

export type IndPaymentRequest = {
    type: string // interview, class
    individualRequest: ObjectId, //foreign key ObjectId
    student: ObjectId, //foreign key ObjectId
    status: string, //pending, submitted, accepted, declined - state variants
    proof: string | null, //link to photo proof
}

export type IndividualMiddleware = {

}
