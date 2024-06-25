import { Image, message, Spin } from "antd/lib";
import axios from "axios";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { baseUrl } from "@/app/config/baseUrl";
import { Button, Card, Avatar, Typography, Space } from "antd/lib";
import { authStore } from "@/app/store/auth/auth.store";

const { Text } = Typography;

const GetProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token: any = localStorage.getItem("access_token_private");
        const decodedToken: any = jwt.decode(token);
        const response = await axios.get(`${baseUrl}my-profile`, {
          headers: { Authorization: token },
        });
        const userProfileData = response.data;
        setUserProfile(userProfileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Failed to fetch user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Spin spinning={loading}>
      {" "}
      <Card style={{ width: "60vw", margin: "auto" }}>
        <div>
          <Image src={userProfile.profilePhoto} width={200} />
        </div>
        {userProfile && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>{userProfile.fullName}</h3>
            <p>{userProfile.aboutMe}</p>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <Button onClick={() => authStore.signOut()}>Sign Out</Button>
        </div>
      </Card>
    </Spin>
  );
};

export default GetProfile;
