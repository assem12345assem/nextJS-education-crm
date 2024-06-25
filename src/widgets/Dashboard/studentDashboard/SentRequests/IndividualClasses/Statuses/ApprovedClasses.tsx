import React from "react";
import { Table, Space, Button } from "antd/lib";
import { Tag } from "antd/lib";

export type Request = {
  requestId: string;
  requestDate: string;
  status: string;
};

const requestData: Request[] = [
  {
    requestId: "1",
    requestDate: "2022-01-15",
    status: "Approved",
  },
  {
    requestId: "2",
    requestDate: "2022-02-20",
    status: "Approved",
  },
];

const ApprovedClasses = () => {
  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
    },

    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Approved" ? "green" : "default"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div>
      <h2>Approved Classes</h2>
      <Table dataSource={requestData} columns={columns} />
    </div>
  );
};

export default ApprovedClasses;
