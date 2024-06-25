// ClassTable.tsx
import React, { useEffect, useState } from "react";
import { Table, Modal, Button, message } from "antd/lib";
import { groupClassStore } from "@/app/store/groupClass/groupClass.store";
import { observer } from "mobx-react-lite";
import StudentModal from "./StudentModal";
import { Divider } from "antd";
import { studentRequestStore } from "@/app/store/requests/request.store";

const ClassTable: React.FC = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studentInfoModal, setStudentInfoModal] = useState(false);
  const [studentModal, setStudentModal] = useState(false);
  const [student, setStudent]: any = useState<any>(false);
  const [groupClassId, setGroupClassId] = useState(null);
  const [groupCourseDetails, setGroupCourseDetails] = useState<any>(null);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
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
      title: "Group Course Details",
      key: "groupCourseDetails",
      render: (_: any, record: any) => (
        <Button onClick={() => handleViewGroupCourse(record)}>
          View Details
        </Button>
      ),
    },
    {
      title: "See Requests",
      key: "enroll",
      render: (_: any, record: any) => (
        <Button onClick={() => handleEnroll(record)}>See Requests</Button>
      ),
    },
  ];

  const handleEnroll = async (record: any) => {
    await groupClassStore.getRequests(record._id);
    setGroupClassId(record._id);
    setIsModalVisible(true);
  };
  const handleViewGroupCourse = (record: any) => {
    setGroupCourseDetails(record.groupCourse);
    setStudentInfoModal(true);
  };

  const handleEdit = (student: any) => {
    setStudent(student); // Set the student object to the editedRow state
    setStudentModal(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setStudent(null);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setStudent(null);
    message.success("Changes saved successfully!");
  };

  const openStudentModal = () => {
    setStudentModal(true);
  };

  const handleDecline = async (record: any) => {
    try {
      const classId = groupClassId; // Assuming class ID is stored in _id of the parent table
      const requestId = record._id; // Assuming request ID is stored in _id of the requests table

      if (classId && requestId) {
        await studentRequestStore.declineStudentRequest(classId, requestId);
      } else {
        message.error("Class ID or Request ID not found.");
      }
    } catch (error) {
      message.error("Failed to decline request. Please try again.");
    }
  };
  const handleAccept = async (record: any) => {
    try {
      const classId = groupClassId;
      const requestId = record._id;

      if (classId && requestId) {
        await studentRequestStore.acceptStudentRequest(classId, requestId);
      } else {
        message.error("Class ID or Request ID not found.");
      }
      await groupClassStore.getRequests(requestId);
    } catch (error) {
      message.error("Failed to decline request. Please try again.");
    }
  };

  const secondTableColumns = [
    {
      title: "Request ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Student Name",
      dataIndex: "student",
      key: "student",
      render: (student: any) => (
        <>
          <div>{student.englishName}</div>
          <div>{student.chineseName}</div>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Accept",
      dataIndex: "",
      key: "",
      render: (_: any, record: any) => (
        <Button
          onClick={() => handleAccept(record)}
          loading={studentRequestStore.loading}
        >
          Accept
        </Button>
      ),
    },
    {
      title: "Decline",
      dataIndex: "",
      key: "",
      render: (_: any, record: any) => (
        <Button
          danger
          onClick={() => handleDecline(record)}
          loading={studentRequestStore.loading}
        >
          Decline
        </Button>
      ),
    },
  ];
  useEffect(() => {
    groupClassStore.getClasses();
  }, []);

  return (
    <div>
      <Table
        dataSource={groupClassStore.classes}
        columns={columns}
        style={{ width: "100%" }}
        loading={groupClassStore.loading}
      />
      <Modal
        title="Group Course Details"
        open={studentInfoModal}
        onCancel={() => setStudentInfoModal(false)}
        footer={null}
      >
        <p>
          <b>Academic Area:</b> {groupCourseDetails?.academicArea}
        </p>
        <p>
          <b>Topic:</b> {groupCourseDetails?.topic}
        </p>
        <p>
          <b>Description:</b> {groupCourseDetails?.description}
        </p>
        <p>
          <b>Syllabus:</b> {groupCourseDetails?.syllabus}
        </p>
        {/* Add more fields as needed */}
      </Modal>
      <Modal
        title=""
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        width={1000}
      >
        <h2>Student requests list for class:</h2>
        <h5>ID: {groupClassId}</h5>
        <Table
          dataSource={groupClassStore.enrollResponse}
          columns={secondTableColumns}
        />
        <StudentModal
          visible={studentModal}
          onCancel={() => setStudentModal(false)}
          onOk={() => setStudentModal(false)}
          student={student}
        />
      </Modal>
    </div>
  );
});

export default ClassTable;
