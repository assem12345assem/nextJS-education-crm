import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  DatePicker,
  message,
  Select,
} from "antd/lib";
import axios from "axios";
import { baseUrl } from "@/app/config/baseUrl";

const { Option } = Select;

const CreateGroupClass: React.FC = () => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);
  const onFinish = async (values: any) => {
    try {
      const token = localStorage?.getItem("access_token_private");
      const response = await axios.post(`${baseUrl}/group-classes`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log("Group class was created!", response.data);
      message.success("Group class was created!");
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form. Please try again later.");
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage?.getItem("access_token_private");
      const response = await axios.get(`${baseUrl}courses`, {
        headers: {
          Authorization: token,
        },
      });
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Failed to fetch courses. Please try again later.");
    }
  };
  const fetchStudents = async () => {
    try {
      const token = localStorage?.getItem("access_token_private");
      const response = await axios.get(`${baseUrl}users`, {
        headers: {
          Authorization: token,
        },
      });
      const studentUsers = response.data.users.filter(
        (user: any) => user.role === "student"
      );
      setStudents(studentUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to fetch students. Please try again later.");
    }
  };

  return (
    <div>
      <Form
        form={form}
        name="CreateGroupClassForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: "500px" }}
      >
        <Form.Item label="Group Course" name="groupCourse">
          <Select placeholder="Select group course">
            {courses.map((course) => (
              <Option key={course._id} value={course._id}>
                {course.topic}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Students" name="students">
          <Select placeholder="Select students">
            {students.map((student) => (
              <Option key={student._id} value={student._id}>
                {student.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please enter the status!" }]}
        >
          <Select
            placeholder="Select status"
            options={[
              {
                label: "Not started",
                value: "not-started",
              },
              {
                label: "Started",
                value: "started",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Starting Date"
          name="starting_date"
          rules={[
            { required: true, message: "Please enter the starting date!" },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Finish Date"
          name="finish_date"
          rules={[{ required: true, message: "Please enter the finish date!" }]}
        >
          <DatePicker />
        </Form.Item>

        {/* <Form.Item
          label="Intake Gallery"
          name="intake_gallery"
          rules={[
            { required: true, message: "Please enter the intake gallery!" },
          ]}
        >
          <Upload>
            <Button>Upload Intake Gallery</Button>
          </Upload>
        </Form.Item> */}

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Receipt"
          name="receipt"
          rules={[{ required: true, message: "Please enter the receipt!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Paypal"
          name="paypal"
          rules={[{ required: true, message: "Please enter the Paypal!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Visa"
          name="visa"
          rules={[{ required: true, message: "Please enter the Visa!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateGroupClass;
