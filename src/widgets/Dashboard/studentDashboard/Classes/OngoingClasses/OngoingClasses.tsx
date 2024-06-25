import React from "react";
import { Table, Space, Image } from "antd/lib";

export type GroupClass = {
  groupCourse: string;
  status: string;
  starting_date: string;
  finish_date: string;
  students: string[];
  intake_gallery: string[];
  price: string;
  receipt: string;
  paypal: string;
  visa: string;
};

const data: GroupClass[] = [
  {
    groupCourse: "Course A",
    status: "Ongoing",
    starting_date: "2022-01-01",
    finish_date: "2022-06-30",
    students: ["Student1", "Student2"],
    intake_gallery: [
      "https://elearningindustry.com/wp-content/uploads/2015/10/6-convincing-reasons-take-elearning-course.jpg",
      "https://assets-global.website-files.com/5e318ddf83dd66608255c3b6/62b1de2e8e142538f54863b6_What%20is%20course%20design.jpg",
    ],
    price: "1000",
    receipt: "ABC123",
    paypal: "paypal@example.com",
    visa: "visa@example.com",
  },
  // Add more data as needed
];

const OngoingClasses = () => {
  // Define columns for the table
  const columns = [
    {
      title: "Group Course",
      dataIndex: "groupCourse",
      key: "groupCourse",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Starting Date",
      dataIndex: "starting_date",
      key: "starting_date",
    },
    {
      title: "Finish Date",
      dataIndex: "finish_date",
      key: "finish_date",
    },
    {
      title: "Students",
      dataIndex: "students",
      key: "students",
      render: (students: string[]) => <Space>{students.join(", ")}</Space>,
    },
    {
      title: "Intake Gallery",
      dataIndex: "intake_gallery",
      key: "intake_gallery",
      render: (intakeGallery: string[]) => (
        <Space>
          {intakeGallery.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`intake-${index}`}
              style={{ width: "50px", height: "50px" }}
            />
          ))}
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Receipt",
      dataIndex: "receipt",
      key: "receipt",
    },
    {
      title: "Paypal",
      dataIndex: "paypal",
      key: "paypal",
    },
    {
      title: "Visa",
      dataIndex: "visa",
      key: "visa",
    },
  ];

  return (
    <div>
      <h2>Ongoing Classes</h2>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default OngoingClasses;
