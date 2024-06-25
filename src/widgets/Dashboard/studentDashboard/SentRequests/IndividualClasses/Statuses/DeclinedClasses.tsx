import React from "react";
import { Table, Space, Button } from "antd/lib";

export type Request = {
  requestId: string;
  requestDate: string;
  status: string;
};

const requestData: Request[] = [
  {
    requestId: "1",
    requestDate: "2022-01-15",
    status: "Declined",
  },
  {
    requestId: "2",
    requestDate: "2022-02-20",
    status: "Declined",
  },
];

const DeclinedClasses = () => {
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
    },
  ];

  return (
    <div>
      <h2>Declined Classes</h2>
      <Table dataSource={requestData} columns={columns} />
    </div>
  );
};

export default DeclinedClasses;
