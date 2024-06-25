import React from "react";
import { Card, Typography, Form, Input, Button, message } from "antd/lib";
import { profileStore } from "@/app/store/profile/profile.store";

const { Title } = Typography;
const { Item } = Form;

const CreateProfile = () => {
  const onFinish = async (values: any) => {
    profileStore.loading = true;
    try {
      await profileStore.createProfile(values);
    } finally {
      profileStore.loading = false;
    }
  };

  return (
    <Card style={{ width: 1000, margin: "auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Create Mentor Profile
      </Title>

      <Form onFinish={onFinish}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Chinese Name is required" }]}
              style={{ width: "100%" }}
            >
              <Input style={{width:'400px'}} />
            </Item>
            <Item
              label="Profile Photo"
              name="profilePhoto"
              rules={[{ required: true, message: "Profile Photo is required" }]}
              style={{ width: "100%" }}
            >
              <Input style={{width:'400px'}} />
            </Item>{" "}
            <Item
              label="Description"
              name="aboutMe"
              rules={[{ required: true, message: "Description" }]}
              style={{ width: "100%" }}
            >
              <Input.TextArea style={{width:'400px'}}/>
            </Item>
          </div>
          <div></div>
        </div>
        <Item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button type="primary" htmlType="submit" style={{ width: "300px" }}>
            Create Profile
          </Button>
        </Item>
      </Form>
    </Card>
  );
};

export default CreateProfile;
