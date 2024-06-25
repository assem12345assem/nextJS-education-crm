import { baseUrl } from "@/app/config/baseUrl";
import { ICourses } from "@/app/interfaces/courses/course";
import { AxiosLinks } from "@/app/libs/axiosLinks";
import CoursesList from "@/widgets/CoursesPage/CoursesList/CoursesList";
import axios from "axios";
import { NextPage } from "next";
import React from "react";

const CoursesPage = ({ courses }: ICourses) => {
  return (
    <div>
      <CoursesList courses={courses} />
    </div>
  );
};

export default CoursesPage;
export const getServerSideProps = async () => {
  try {
    const res = await axios.get(`${baseUrl}courses`);
    const courses = res.data.courses;
    return { props: { courses } };
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return { props: { courses: [] } };
  }
};
