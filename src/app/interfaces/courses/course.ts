export interface ICourse {
  _id: string;
  academicArea: string;
  topic: string;
  description: string;
  syllabus: string;
  files: string[];
  mentor: string;
  gallery: string[];
  __v: number;
}

export interface CourseType {
  course: ICourse;
}

export interface ICourses {
  courses: ICourse[] | any;
}
