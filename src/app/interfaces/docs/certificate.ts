export interface ICertificate {
    _id: string,
    student: string,
    class: string,
    instructor: string,
    digitalSignature: string,
    digitalStamp: string,
    additionalInfo: string,
    dateIssued: string
}
export interface ICertificate {
    certificate: ICertificate;
    course?:any
}
export interface ICertificates {
    certificates: ICertificate[] | any;
}