import React, { useEffect, useState } from "react";
import { Table, Modal, Form, Input, Button, message } from "antd/lib";
import axios from "axios";
import { baseUrl } from "@/app/config/baseUrl";

const CourseTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedRow, setEditedRow] = useState<any | null>(null);
  useEffect(() => {
    // Fetch data from API when component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token_private");
      const response = await axios.get(`${baseUrl}courses`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setDataSource(response.data.courses); // Assuming your API returns an array of data
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "course ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Academic Area",
      dataIndex: "academicArea",
      key: "academicArea",
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Syllabus",
      dataIndex: "syllabus",
      key: "syllabus",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      key: "action",
      render: (_: any, record: any) => (
        <Button onClick={() => handleDelete(record)}>Delete </Button>
      ),
    },
  ];

  const handleDelete = (record: any) => {
    setDataSource((prevDataSource) =>
      prevDataSource.filter((item) => item !== record)
    );
    message.success("Course was deleted successfully!");
  };

  const handleEdit = (record: any) => {
    setEditedRow(record);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditedRow(null);
  };

  const handleModalOk = () => {
    // Add your logic to update the data in dataSource
    setIsModalVisible(false);
    setEditedRow(null);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ maxWidth: "1000px" }}
        loading={loading}
      />
      <Modal
        title="Edit Course"
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      >
        <Form initialValues={editedRow} layout="vertical">
          <Form.Item label="Academic Area" name="academicArea">
            <Input />
          </Form.Item>
          <Form.Item label="Topic" name="topic">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Syllabus" name="syllabus">
            <Input />
          </Form.Item>
          <Form.Item label="Files" name="files">
            <Input />
          </Form.Item>

          <Form.Item label="Gallery" name="gallery">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseTable;
