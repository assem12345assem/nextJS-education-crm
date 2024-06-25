// SessionModal.tsx
import React from "react";
import { Modal, Button } from "antd/lib";

interface SessionModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  return (
    <Modal open={visible} onCancel={onCancel} onOk={onOk} width={1000}>
        Sessions here
    </Modal>
  );
};

export default SessionModal;
