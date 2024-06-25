import { Layout, Menu, MenuProps, Tag, Tooltip } from "antd/lib";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authStore } from "@/app/store/auth/auth.store";
import jwt from "jsonwebtoken";
import { observer } from "mobx-react-lite";
import styles from "./Header.module.css";
const { Header } = Layout;

interface InnerItemType {
  key: string;
  label: string;
  path: string;
}
const HeaderComponent = observer(() => {
  const router = useRouter();
  const { isAuth } = authStore;

  const menuItems: Array<InnerItemType> = [
    { key: "main", label: "Chat-Ivy", path: "/" },
    { key: "courses", label: "Courses", path: "/courses" },
    { key: "group-classes", label: "Group classes", path: "/group-classes" },
  ];
  const isActive = (path: string): boolean => router.pathname === path;
  const [userInfo, setUserInfo]: any = useState(null);
  useEffect(() => {
    try {
      const token: any = localStorage.getItem("access_token_private");
      const decodedToken = jwt.decode(token);
      setUserInfo(decodedToken);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [authStore.isAuth, router]);

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        color: "white",
        justifyContent: "space-between",
      }}
    >
      <Menu
        style={{ width: "400px" }}
        theme="dark"
        mode="horizontal"
        selectedKeys={menuItems
          .filter((item) => isActive(item.path))
          .map((item) => item.key)}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key}>
            <Link href={item.path} passHref>
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <div className={styles.topBlock}>
        {!isAuth && <Link href={"../login"}>Log in</Link>}
        &nbsp; &nbsp;
        <Tooltip title="Go to dashboard">
          {isAuth && <Link href={"../dashboard"}>{userInfo?.username}</Link>}
        </Tooltip>
        &nbsp; &nbsp;
        {userInfo?.role == "curator" && <p>Curator profile</p>}
        {userInfo?.role == "mentor" && <p>mentor profile</p>}
      </div>
    </Header>
  );
});

export default HeaderComponent;
