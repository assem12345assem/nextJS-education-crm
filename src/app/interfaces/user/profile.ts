import {ICourse} from "@/app/interfaces/courses/course";

export interface IStudent {
    _id: string,
    chineseName: string,
    englishName: string,
    profilePhoto: string,
    studentContacts: [{
        contactType: string,
        contactValue: string
    }],
    parentContacts: [{
        contactType: string,
        contactValue: string
    }]
    background: [{
        backgroundType: string,
        backgroundValue: string
    }]
};

export interface IStudent {
    student: IStudent
}
export interface IStudents {
    students: IStudent[] | any;
}
export interface IInstructor {
    _id: string,
    fullName: string,
    profilePhoto: string,
    aboutMe: string
}
export interface IInstructor {
    instructor: IInstructor
}
export interface IInstructors {
    instructors: IInstructor[] | any;
}