import React from "react";
import { Breadcrumb, Row, Col } from "antd/lib";
import { ICourse, ICourses } from "@/app/interfaces/courses/course";
import styles from "./coursesList.module.scss";
import Container from "@/shared/ui/container/Container";
import CourseCard from "../CourseCard/CourseCard";
import Link from "next/link";

const CoursesList = ({ courses }: ICourses) => {
  return (
    <div className={styles.wrapper}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Courses</Breadcrumb.Item>
      </Breadcrumb>{" "}
      <Container>
        <Row gutter={[16, 16]}>
          {courses &&
            courses.map((course: ICourse) => (
              <Col span={8} key={course._id}>
                <CourseCard course={course} />{" "}
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default CoursesList;
