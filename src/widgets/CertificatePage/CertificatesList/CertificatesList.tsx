import React from "react";
import { Breadcrumb, Row, Col, Typography } from "antd/lib";
import { ICourse, ICourses } from "@/app/interfaces/courses/course";
import styles from "./coursesList.module.scss";
import Container from "@/shared/ui/container/Container";
import CourseCard from "../../CoursesPage/CourseCard/CourseCard";
import Link from "next/link";
import { ICertificate, ICertificates } from "@/app/interfaces/docs/certificate";
import Title from "antd/es/skeleton/Title";
const CertificatesList = ({ certificates }: any) => {
  return (
    <div className={styles.wrapper}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Certificates</Breadcrumb.Item>
      </Breadcrumb>{" "}
      {/*<Container>*/}
      <Row gutter={[16, 16]}>
        {certificates &&
          certificates.map((certificate: ICertificate) => (
            <Col span={8} key={certificate._id}>
              {/*<CourseCard course={certificate} />{" "}*/}
              <p>{certificate.course}</p>
              <p>{certificate.student}</p>
              <p>{certificate.instructor}</p>
            </Col>
          ))}
      </Row>
      {/*</Container>*/}
    </div>
  );
};

export default CertificatesList;
