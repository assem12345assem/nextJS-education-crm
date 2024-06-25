import { baseUrl } from "@/app/config/baseUrl";
import { individualClassStore } from "@/app/store/individualClass/individualClass.store";
import {
  Table,
  Tag,
  message,
  Empty,
  Button,
  Modal,
  Popconfirm,
} from "antd/lib";
import Title from "antd/lib/typography/Title";
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

const StudentRequests = observer(() => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}individual-classes/enroll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("access_token_private")}`,
        },
      });
      setRequests(response.data.individualRequests);
      console.log("ura");
    } catch (error) {
      console.error("Error fetching individual requests:", error);
      message.error("Error fetching individual requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDescriptionClick = (description: string) => {
    setModalContent(description);
    setModalVisible(true);
  };

  const handleAccept = async (record: any) => {
    await individualClassStore.accept(record._id).then(() => {
      fetchRequests();
    });
  };

  const handleDecline = async (record: any) => {
    await individualClassStore.decline(record._id).then(() => {
      fetchRequests();
    });
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
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
      render: (description: string) => (
        <Button type="link" onClick={() => handleDescriptionClick(description)}>
          View
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "";
        switch (status) {
          case "accepted":
            color = "green";
            break;
          case "declined":
            color = "red";
            break;
          default:
            color = "blue";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Accept",
      dataIndex: "",
      key: "",
      render: (_: any, record: any) => (
        <Popconfirm
          title="Are you sure you want to accept this request?"
          onConfirm={() => handleAccept(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Accept</Button>
        </Popconfirm>
      ),
    },
    {
      title: "Decline",
      dataIndex: "",
      key: "",
      render: (_: any, record: any) => (
        <Popconfirm
          title="Are you sure you want to decline this request?"
          onConfirm={() => handleDecline(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button>Decline</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Title>Individual request list</Title>
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        style={{ minWidth: "1000px" }}
      />
      <Modal
        title="Description"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        <p>{modalContent}</p>
      </Modal>
    </>
  );
});

export default StudentRequests;
