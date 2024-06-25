import { Tabs } from "antd/lib";
import React from "react";
import CreateRequestIndividualClass from "./CreateIndividualClass/CreateRequestIndividualClass";
import IndividualRequestList from "./IndividualRequestList/IndividualRequestList";

const IndividualClassRequests = () => {
  return (
    <Tabs
      items={[
        {
          label: "Create request for individual class",
          key: "1",
          children: <CreateRequestIndividualClass />,
        },
        {
          label: "Sent requests for individual class",
          key: "2",
          children: <IndividualRequestList />,
        },
      ]}
    />
  );
};

export default IndividualClassRequests;
