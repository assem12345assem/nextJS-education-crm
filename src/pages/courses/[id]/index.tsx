// pages/courses/[requestId].js
import { baseUrl } from "@/app/config/baseUrl";
import { CourseType } from "@/app/interfaces/courses/course";
import { AxiosLinks } from "@/app/libs/axiosLinks";
import Container from "@/shared/ui/container/Container";
import CoursesDetailComponent from "@/widgets/CoursesPage/CoursesDetail/CoursesDetail";
import axios, { AxiosError } from "axios"; // Import Axios
import Error from "next/error";
import React from "react";

const CourseDetail = ({ course }: CourseType) => {
  return (
    <div>
      <CoursesDetailComponent course={course} />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  let course = null;

  try {
    const response = await axios.get(`${baseUrl}courses/${id}`);
    course = response.data.courseData;
  } catch (error: any) {
    console.error(
      "An error occurred while fetching course details:",
      error.message
    );
  }

  return { props: { course } };
}

export default CourseDetail;
