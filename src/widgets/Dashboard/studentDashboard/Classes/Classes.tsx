import { Tabs } from "antd/lib";
import React from "react";
import OngoingClasses from "./OngoingClasses/OngoingClasses";
import ClassesHistory from "./ClassesHistory/ClassesHistory";

const Classes = () => {
  return (
    <div>
      <h1>My Classes</h1>
      <Tabs
        items={[
          {
            label: "Ongoing classes",
            key: "1",
            children: <OngoingClasses />,
          },
          {
            label: "Classes History",
            key: "2",
            children: <ClassesHistory />,
          },
        ]}
      />
    </div>
  );
};

export default Classes;
