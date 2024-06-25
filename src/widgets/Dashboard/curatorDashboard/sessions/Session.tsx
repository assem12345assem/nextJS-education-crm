import { Tabs } from "antd/lib";
import Title from "antd/lib/typography/Title";
import React from "react";
import CreateSession from "./CreateSession";

const Session = () => {
  return (
    <div style={{width:'1000px'}}>
      <Title>session students</Title>
      <Tabs
        items={[
          {
            label: "Create session",
            key: "1",
            children: <CreateSession />,
          },
        ]}
      />
    </div>
  );
};

export default Session;
