import { Tabs } from "antd/lib";
import React from "react";
import PendingClasses from "./Statuses/PendingClasses";
import ApprovedClasses from "./Statuses/ApprovedClasses";
import DeclinedClasses from "./Statuses/DeclinedClasses";

const IndividualClassRequests = () => {
  return (
    <div>
      <h1>Individual class requests</h1>
      <Tabs
        items={[
          {
            label: "Approved classes",
            key: "2",
            children: <ApprovedClasses />,
          },
          {
            label: "Pending",
            key: "1",
            children: <PendingClasses />,
          },

          {
            label: "Declined classes",
            key: "3",
            children: <DeclinedClasses />,
          },
        ]}
      />
    </div>
  );
};

export default IndividualClassRequests;
