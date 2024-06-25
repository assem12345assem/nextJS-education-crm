import {ObjectId} from "mongodb";

export type GroupCourse = {
  academicArea: string;
  topic: string;
  description: string;
  syllabus: string;
  files: string[];
  mentor: string;
  gallery: string[];
};

export type GroupClass = {
  groupCourse: string, //foreign key ObjectID
  mentor: string, //foreign key ObjectID
  status: string,
  starting_date: string,
  finish_date: string,
  students: ObjectId[], //foreign keys ObjectIDs
  price: string,
  receipt: string,
  paypal: string, // blank for feature
  visa: string, // blank for feature
}