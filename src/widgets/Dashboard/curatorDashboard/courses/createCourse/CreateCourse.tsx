import React from "react";
import { Form, Input, Button, Upload, message } from "antd/lib";
import { ICourse } from "@/app/interfaces/courses/course";
import axios from "axios";
import { baseUrl } from "@/app/config/baseUrl";

interface CourseFormProps {
  onSubmit?: (values: ICourse) => void;
  initialValues?: ICourse;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: ICourse) => {
    try {
      const token = localStorage?.getItem("access_token_private");
      const response = await axios.post(`${baseUrl}/courses`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log("Form submitted:", response.data);
      message.success("Course was created successfully!");
      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form. Please try again later.");
    }
  };

  const handleFinish = (values: ICourse) => {
    handleSubmit(values);
  };

  const handleFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="courseForm"
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      initialValues={initialValues}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width: "500px" }}
    >
      <Form.Item
        label="Academic Area"
        name="academicArea"
        rules={[{ required: true, message: "Please enter the academic area!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Topic"
        name="topic"
        rules={[{ required: true, message: "Please enter the topic!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Syllabus"
        name="syllabus"
        rules={[{ required: true, message: "Please enter the syllabus!" }]}
      >
        <Input />
      </Form.Item>
      {/* 
      <Form.Item label="Files" name="files">
        <Upload>
          <Button>Upload Files</Button>
        </Upload>
      </Form.Item> */}

      <Form.Item label="Gallery" name="gallery">
        {/* <Upload>
          <Button>Upload Gallery</Button>
        </Upload> */}
        <Input placeholder="add Url or photo" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;
