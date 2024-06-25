export type StudentProfile = {
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

export type InstructorProfile = {
    fullName: string,
    profilePhoto: string,
    aboutMe: string
};
