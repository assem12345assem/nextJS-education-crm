import React, { useEffect } from "react";
import { Table, Space, Button } from "antd/lib";
import { Tag } from "antd/lib";
import { groupClassStore } from "@/app/store/groupClass/groupClass.store";
import { studentRequestStore } from "@/app/store/requests/request.store";
import { observer } from "mobx-react-lite";
import Link from "next/link";

export type Request = {
  requestId: string;
  requestDate: string;
  status: string;
};

const PendingClasses = observer(() => {
  useEffect(() => {
    studentRequestStore.getGroupClassesRequestsStudents();
  }, []);

  const filteredRequests = studentRequestStore.requests.filter(
    (request: Request) => request.status === "pending"
  );

  const columns = [
    {
      title: "groupClass",
      dataIndex: "groupClass",
      key: "groupClass",
      render: (groupClass: string) => {
        return (
          <Link href={`../group-classes/${groupClass}`}>{groupClass}</Link>
        );
      },
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
      <h2>Pending Classes</h2>
      <Table
        dataSource={filteredRequests}
        columns={columns}
        loading={studentRequestStore.loading}
      />
    </div>
  );
});

export default PendingClasses;
