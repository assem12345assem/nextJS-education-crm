import React from "react";
import {
  Card,
  Tag,
  Breadcrumb,
  Typography,
  Button,
  Carousel,
  Image,
} from "antd/lib";
import Link from "next/link";
import styles from "./courseDetail.module.scss";
import { CourseType } from "@/app/interfaces/courses/course";
import CommonSlider from "@/widgets/Dashboard/studentDashboard/Certificates/Certificates/slider/SliderCertificate";

const { Title, Paragraph } = Typography;

const CoursesDetailComponent = ({ course }: CourseType) => {
  return (
    <div className={styles.wrapper}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={"/courses"}>Courses</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{course?.academicArea}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className={styles.courseCard}>
        <div className={styles.header}>
          <Title level={2}>{course.topic}</Title>
          <Title level={4} className={styles.academicArea}>
            {course.academicArea}
          </Title>
        </div>
        {Array.isArray(course.gallery) ? (
          <Carousel autoplay autoplaySpeed={2000}>
            {course?.gallery?.map((image, index) => (
              <div key={index}>
                <Image
                  src={image}
                  alt={`gallery-image-${index}`}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <Image
            src={course.gallery}
            alt={`single-gallery-image`}
            style={{ width: "100%" }}
          />
        )}
        <Paragraph className={styles.description}>
          {course.description}
        </Paragraph>
        {course.syllabus && (
          <>
            <Title level={5}>Syllabus</Title>
            <Paragraph className={styles.syllabus}>{course.syllabus}</Paragraph>
          </>
        )}
        <Paragraph className={styles.mentor}>Mentor: {course.mentor}</Paragraph>
        <div className={styles.gallery}></div>
        <Button>Make request for course</Button>
      </Card>
    </div>
  );
};

export default CoursesDetailComponent;
