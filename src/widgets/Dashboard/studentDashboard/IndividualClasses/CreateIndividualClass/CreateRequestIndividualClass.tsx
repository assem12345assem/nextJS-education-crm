import React from "react";
import { Form, Input, Button } from "antd/lib";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react-lite";
import { individualClassStore } from "@/app/store/individualClass/individualClass.store";
import { Vidaloka } from "next/font/google";
const CreateRequestIndividualClass = observer(() => {
  const { createRequestIndividualClass } = individualClassStore;
  const onFinish = (values: any) => {
    createRequestIndividualClass(values);
  };

  return (
    <Form name="createRequest" onFinish={onFinish} layout="vertical">
      <Title style={{ fontSize: "20px" }}>
        Create request for individual class
      </Title>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter the title" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Send
        </Button>
      </Form.Item>
    </Form>
  );
});

export default CreateRequestIndividualClass;
