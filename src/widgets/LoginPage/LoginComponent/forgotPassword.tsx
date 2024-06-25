import React, {useState} from "react";
import {Breadcrumb, Button, Form, Input, message, Spin, Typography,} from "antd/lib";
import styles from "./login.module.scss";
import Link from "next/link";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";
import axios from "axios";
import {baseUrl} from "@/app/config/baseUrl";

const {Title} = Typography;

const ForgotPassword = observer(() => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            setLoading(true);
            setErrorMessage('');
            const response = await axios.post(`${baseUrl}forgot-password`, {username: values.username});

            if (response.status === 200) {
                message.success(response.data.message);
                router.push('/login');
            } else {
                setErrorMessage(response.data.message);
            }

            setLoading(false);
        } catch (error: any) {
            console.error("Error during submitting email:", error.message);
            message.error(error.response.data.message);
            setLoading(false);
        }
    };
    return (
        <div className={styles.wrapper}>
            <Breadcrumb style={{margin: "16px 0"}}>
                <Breadcrumb.Item>
                    <Link href={"/"}>Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Forgot Password</Breadcrumb.Item>
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
                        Forgot Password
                    </Title>
                    <Form name="forgot-password" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Please enter your email: "
                            name="username"
                            rules={[
                                {required: true, message: "Please enter your username!"},
                            ]}
                        >
                            <Input placeholder="Email"/>
                        </Form.Item>

                        {loading && (
                            <div>
                                please,wait
                                <Spin/>
                            </div>
                        )}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Submit
                            </Button>
                        </Form.Item>
                        <Link href="/login">Go back to Login page</Link>
                    </Form>
                </div>
            </div>
        </div>
    );
});
export default ForgotPassword;
