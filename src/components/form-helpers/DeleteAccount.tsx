import React, { useState } from "react";
import { Modal, Button, Input } from "antd";

const DeleteAccount: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    // Handle account deletion logic here
    console.log("Account deleted with password:", password);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Delete Account
      </Button>
      <Modal
        title="Confirm Account Deletion"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete your account? Please enter your
          password to confirm.
        </p>
        <Input.Password
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default DeleteAccount;
