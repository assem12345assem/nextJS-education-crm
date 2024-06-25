import React from "react";
import { Breadcrumb, Row, Col } from "antd/lib";
import { ICourse, ICourses } from "@/app/interfaces/courses/course";
import styles from "./coursesList.module.scss";
import Container from "@/shared/ui/container/Container";
import ClassCard from "../ClassCard/ClassCard";
import Link from "next/link";

const ClassesList = ({ classes }: any) => {
  return (
    <div className={styles.wrapper}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Group Classes</Breadcrumb.Item>
      </Breadcrumb>{" "}
      <Container>
        <Row gutter={[16, 16]}>
          {classes.map((groupClass: any) => (
            <Col span={8} key={groupClass.groupCourse}>
              <ClassCard groupClass={groupClass} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ClassesList;
