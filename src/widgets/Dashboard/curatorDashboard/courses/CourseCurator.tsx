import React from "react";
import { Tabs } from "antd/lib";
import CreateCourse from "./createCourse/CreateCourse";
import CourseTable from "./courseTable/CourseTable";
import { Button } from "antd/lib";
import { authStore } from "@/app/store/auth/auth.store";

const CourseCurator: React.FC = () => {
  return (
    <div>
      <Button onClick={() => authStore.signOut()}>Log out</Button>

      <h1>Courses</h1>
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ margin: 0 }}
        items={[
          {
            label: "Create Course",
            key: "1",
            children: <CreateCourse />,
          },
          {
            label: "Course list",
            key: "2",
            children: <CourseTable />,
          },
        ]}
      />
    </div>
  );
};

export default CourseCurator;
