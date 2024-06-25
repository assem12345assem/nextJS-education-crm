import { Tabs } from "antd/lib";
import React from "react";
import GroupClassRequests from "./GroupClasses/GroupClassRequests";
import IndividualClassRequests from "./IndividualClasses/IndividualClassRequests";

const Requests = () => {
  return (
    <div>
      <h1>My Group Class requests</h1>
      <GroupClassRequests />
    </div>
  );
};

export default Requests;
