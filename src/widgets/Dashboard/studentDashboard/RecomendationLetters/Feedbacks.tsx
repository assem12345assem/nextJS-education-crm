import { Tabs } from "antd/lib";
import Title from "antd/lib/typography/Title";
import React from "react";
import Certificates from "../Certificates/Certificates/Certificates";
import Letters from "./Letters/Letters";

const Feedbacks = () => {
  return (
    <div>
      <Title>Feedbacks</Title>
      <Tabs
        items={[
          {
            label: "Certificates",
            children: <Certificates />,
            key: "1",
          },
          {
            label: "Recomendation letters",
            children: <Letters />,
            key: "2",
          },
        ]}
      />
    </div>
  );
};

export default Feedbacks;
