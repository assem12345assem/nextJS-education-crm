// StudentModal.tsx
import React from "react";
import { Modal, Button } from "antd/lib";

interface StudentModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  student: any;
}

const StudentModal: React.FC<StudentModalProps> = ({
  visible,
  onCancel,
  onOk,
  student,
}) => {
    console.log(student)
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      width={1000}
    >
      {/* <p>Chinese Name: {student.chineseName}</p>
      <p>English Name: {student.englishName}</p> */}
    </Modal>
  );
};

export default StudentModal;
