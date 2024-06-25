import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Image, Button, message } from "antd/lib";
import { authStore } from "@/app/store/auth/auth.store";
import CreateProfile from "./CreateProfile";
import { Tabs } from "antd/lib";
import { baseUrl } from "@/app/config/baseUrl";
import GetProfile from "./GetProfile";

const { Title, Paragraph } = Typography;

const Profile: React.FC = () => {
  return (
    <>
      <Tabs
        items={[
          {
            label: "create profile",
            key: "1",
            children: <CreateProfile />,
          },
          {
            label: "profile",
            key: "2",
            children: <GetProfile />,
          },
        ]}
      />
    </>
  );
};

export default Profile;
