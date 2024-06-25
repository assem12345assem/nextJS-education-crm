import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {Breadcrumb, Button, Form, Input, message, Spin, Typography,} from "antd/lib";
import styles from "@/widgets/LoginPage/LoginComponent/login.module.scss";
import Link from "next/link";
import {baseUrl} from "@/app/config/baseUrl";
import axios from "axios";

const {Title} = Typography;

const ResetPasswordPage = () => {
    const router = useRouter();

    const token = router.query.token?.toString() || '';
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const verifyToken = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${baseUrl}reset-password/verify`, {token: token});
                if (response.status === 200) {
                    setVerified(true);
                    const userData = response.data;
                    setUser(userData);
                } else {
                    message.error("Invalid or expired token")
                }
                setLoading(false);
            } catch (error: any) {
                message.error(error.response.data.message);
                setLoading(false);
            }
        };

        if (token) {
            verifyToken();
        }
    }, []);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            const password = values.password;
            const confirmPassword = values.confirmPassword;
            if (password !== confirmPassword) {
                message.error("Entered passwords do not match.")
                setLoading(false);
                return;
            }

            const response = await axios.post(`${baseUrl}reset-password`,
                {password: values.password, username: user});

            if (response.status === 200) {
                message.success(response.data.message);
                router.push('/login');
            } else {
                message.error(response.data.message);
            }

            setLoading(false);
        } catch (error: any) {
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
                <Breadcrumb.Item>Reset Password</Breadcrumb.Item>
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
                        Reset Password
                    </Title>
                    <Form name="reset-password" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="password"
                            name="password"
                            rules={[
                                {required: true, message: "Please enter your password!"},
                            ]}
                        >
                            <Input.Password placeholder="password"/>
                        </Form.Item>
                        <Form.Item
                            label="confirm password"
                            name="confirmPassword"
                            rules={[
                                {required: true, message: "Please confirm your password!"},
                            ]}
                        >
                            <Input.Password placeholder="confirm password"/>
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
                        <br/>
                    </Form>
                </div>
            </div>
        </div>
    );

};

export default ResetPasswordPage;

