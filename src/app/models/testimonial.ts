export type Testimonial = {
    groupClass: string,//foreign key ObjectId
    student: string, //foreign key ObjectId
    rate: number,
    comment: string,
    date: string
}

export type ClassLike = {
    groupClass: string,//foreign key ObjectId
    student: string, //foreign key ObjectId
    date: string
}