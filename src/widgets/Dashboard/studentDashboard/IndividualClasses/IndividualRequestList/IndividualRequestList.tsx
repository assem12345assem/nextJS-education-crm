import { baseUrl } from "@/app/config/baseUrl";
import { Table, Tag, message, Empty } from "antd/lib";
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

const IndividualRequestList = observer(() => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${baseUrl}individual-classes/enroll`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("access_token_private")}`,
            },
          }
        );
        setRequests(response.data.individualRequests);
        console.log("ura");
      } catch (error) {
        console.error("Error fetching individual requests:", error);
        message.error("Error fetching individual requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const columns = [
    {
      title: "Request ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
    <>
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        style={{ width: "1000px" }}
      />
    </>
  );
});

export default IndividualRequestList;
