import { Tabs } from "antd/lib";
import React, { useEffect } from "react";
import PendingClasses from "./Statuses/PendingClasses";
import ApprovedClasses from "./Statuses/ApprovedClasses";
import DeclinedClasses from "./Statuses/DeclinedClasses";
import { observer } from "mobx-react-lite";
import { studentRequestStore } from "@/app/store/requests/request.store";

const GroupClassRequests = observer(() => {
  return (
    <div style={{ width: "1000px" }}>
      <h1>Group class requests</h1>
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
});

export default GroupClassRequests;
