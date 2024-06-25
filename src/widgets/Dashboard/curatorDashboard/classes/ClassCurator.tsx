import React from "react";
import { Tabs } from "antd/lib";
import CreateClass from "./createClass/CreateClass";
import ClassTable from "./classTable/ClassTable";
import { observer } from "mobx-react-lite";

const { TabPane } = Tabs;

const ClassCurator: React.FC = observer(() => {
  return (
    <div>
      <h1>Classes </h1>
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ margin: 0 }}
        items={[
          {
            label: "Create Class",
            key: "1",
            children: <CreateClass />,
          },
          {
            label: "Class list",
            key: "2",
            children: <ClassTable />,
          },
        ]}
      />
    </div>
  );
});

export default ClassCurator;
