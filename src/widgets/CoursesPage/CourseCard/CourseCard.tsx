// CourseCard.tsx or CourseCard.jsx
import React from "react";
import { Card, Image, Button } from "antd/lib";
import { ICourse } from "@/app/interfaces/courses/course";
import Link from "next/link";
import styles from "./courseCard.module.scss"; // Assume we have some styling here
import { CarouselComponent } from "@/widgets/MainPage/MainSlider/CarouselComponent";
import CardCarousel from "@/widgets/CardsCarousel/CardCarosel";

const CourseCard = ({ course }: any) => {
  return (
    <Card
      title={course.topic}
      bordered={false}
      hoverable
      className={styles.courseCard}
    >
      <div className={styles.innerContent}>
        {Array.isArray(course.gallery) ? (
          <CardCarousel imgprops={course.gallery} />
        ) : (
          <Image src={course.gallery} />
        )}
        <br />
        <h3>{course.academicArea}</h3>
        <p>Description: {course.description.slice(0, 160) + "..."}</p>
        <p>Syllabus: {course.syllabus}</p>
        {course.files && (
          <div>
            <h4>Files:</h4>
            <ul>
              {course.files.map((file: any, index: any) => (
                <li key={index}>
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p>
          <strong>Mentor</strong>: {course.mentor}
        </p>
      </div>

      <div className={styles.buttonZone}>
        <Link href={`/courses/${course._id}`}>
          <Button type="primary"> Go to Course page</Button>
        </Link>
      </div>
    </Card>
  );
};

export default CourseCard;
