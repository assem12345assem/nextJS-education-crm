import React, { useEffect } from "react";
import { Table, Space, Button } from "antd/lib";
import { Tag } from "antd/lib";
import { groupClassStore } from "@/app/store/groupClass/groupClass.store";
import { studentRequestStore } from "@/app/store/requests/request.store";
import { observer } from "mobx-react-lite";

export type Request = {
  requestId: string;
  requestDate: string;
  status: string;
};

const ApprovedClasses = observer(() => {
  useEffect(() => {
    studentRequestStore.getGroupClassesRequestsStudents();
  }, []);

  const filteredRequests = studentRequestStore.requests.filter(
    (request: Request) => request.status === "accepted"
  );

  const columns = [
    {
      title: "groupClass",
      dataIndex: "groupClass",
      key: "groupClass",
    },
    {
      title: "student",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "accepted" ? "green" : "default"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div>
      <h2>Approved Classes</h2>
      <Table
        dataSource={filteredRequests}
        columns={columns}
        loading={studentRequestStore.loading}
      />
    </div>
  );
});

export default ApprovedClasses;
