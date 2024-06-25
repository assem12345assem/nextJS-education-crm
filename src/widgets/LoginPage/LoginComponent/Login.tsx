import React from "react";
import {Breadcrumb, Button, Form, Input, message, Spin, Typography,} from "antd/lib";
import styles from "./login.module.scss";
import Link from "next/link";
import {authStore} from "@/app/store/auth/auth.store";
import {SignInType} from "@/app/store/auth/auth.interface";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";

const {Title} = Typography;

const Login = observer(() => {
    const route = useRouter();
    const {signIn, loading} = authStore;
    const onFinish = async (values: SignInType) => {
        try {
            await signIn(values);
            message.success("Auth success");
            route.push("/dashboard");
        } catch (error: any) {
            console.error("Error during login:", error.message);
        }
    };
    return (
        <div className={styles.wrapper}>
            <Breadcrumb style={{margin: "16px 0"}}>
                <Breadcrumb.Item>
                    <Link href={"/"}>Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Login</Breadcrumb.Item>
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
                    <Title level={3} style={{textAlign: "center"}}>
                        Login
                    </Title>
                    <Form name="login" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {required: true, message: "Please enter your username!"},
                            ]}
                        >
                            <Input placeholder="Username"/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {required: true, message: "Please enter your password!"},
                            ]}
                        >
                            <Input.Password placeholder="Password"/>
                        </Form.Item>
                        {loading && (
                            <div>
                                please,wait
                                <Spin/>
                            </div>
                        )}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Log In
                            </Button>
                        </Form.Item>
                        <Link href="/forgot-password">Forgot your password? Click here</Link>
                        <br/><br/>
                        <Link href="/sign-up">Don't have an account? sign up</Link>
                    </Form>
                </div>
            </div>
        </div>
    );
});
export default Login;
