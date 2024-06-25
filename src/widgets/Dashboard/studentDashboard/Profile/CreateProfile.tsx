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
        Create Profile
      </Title>

      <Form onFinish={onFinish} >
        <div style={{ display: 'flex', justifyContent:'space-between' }}>
          <div>
            <Item
              label="Chinese Name"
              name="chineseName"
              rules={[{ required: true, message: "Chinese Name is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="English Name"
              name="englishName"
              rules={[{ required: true, message: "English Name is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="Profile Photo"
              name="profilePhoto"
              rules={[{ required: true, message: "Profile Photo is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="Student Contact Type"
              name={["studentContacts", 0, "contactType"]}
              rules={[{ required: true, message: "Contact Type is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="Student Contact Value"
              name={["studentContacts", 0, "contactValue"]}
              rules={[{ required: true, message: "Contact Value is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
          </div>
          <div>
            <Item
              label="Parent Contact Type"
              name={["parentContacts", 0, "contactType"]}
              rules={[{ required: true, message: "Contact Type is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="Parent Contact Value"
              name={["parentContacts", 0, "contactValue"]}
              rules={[{ required: true, message: "Contact Value is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="Background Type"
              name={["background", 0, "backgroundType"]}
              rules={[{ required: true, message: "Background Type is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
            <Item
              label="Background Value"
              name={["background", 0, "backgroundValue"]}
              rules={[{ required: true, message: "Background Value is required" }]}
              style={{width:'100%'}}
            >
              <Input />
            </Item>
          </div>
        </div>
        <Item style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Button type="primary" htmlType="submit" style={{ width: "300px"}}>
            Create Profile
          </Button>
        </Item>
      </Form>
    </Card>
  );
};

export default CreateProfile;
