import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Breadcrumb,
  message,
  Select,
  Spin
} from "antd/lib";
import { IUser } from "@/app/interfaces/user/user";
import styles from "./login.module.scss";
import Link from "next/link";
import { authStore } from "@/app/store/auth/auth.store";
import { SignUpType } from "@/app/store/auth/auth.interface";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

const { Title } = Typography;

const SignUpComponent = observer(() => {
  const { signUp, loading } = authStore;
  const route = useRouter();
  const onFinish = async (values: SignUpType) => {
    try {
      await signUp(values);
      message.success("Auth success");
      route.push("/dashboard");
    } catch (error: any) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href={"/"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Sign Up</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.innerWrapper}>
        <div
          style={{
            width: 300,
            padding: 20,
            border: "1px solid #e8e8e8",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ textAlign: "center" }}>
            Sign Up
          </Title>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please enter your role!" }]}
              initialValue={"student"}
            >
              <Select
                options={[
                  {
                    label: "Student",
                    value: "student",
                  },
                  {
                    label: "Mentor",
                    value: "mentor",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up{" "}
              </Button>
            </Form.Item>
            {loading && (
              <div>
                please,wait
                <Spin />
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
});
export default SignUpComponent;
