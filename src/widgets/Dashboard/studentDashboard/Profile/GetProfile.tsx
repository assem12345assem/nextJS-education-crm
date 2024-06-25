import { message, Spin } from "antd/lib";
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
        setLoading(false); // Set loading to false when request completes (either success or error)
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Spin spinning={loading}>
      {" "}
      {/* Use Spin component with the loading state */}
      <Card style={{ width: '60vw', margin: "auto" }}>
        {userProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={userProfile.profilePhoto} size={100} style={{ marginBottom: '1rem' }} />
            <Text>ID: {userProfile._id}</Text>
            <hr style={{ width: '100%', backgroundColor: 'gray', borderTop: 'none', marginBottom: '2rem' }} />
            <Space style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap:'1rem' }}>
                <Text type="secondary">English Name: {userProfile.englishName}</Text>
                <Text type="secondary">Chinese Name: {userProfile.chineseName}</Text>
                <Text type="secondary">
                  Background: {userProfile.background[0].backgroundType}
                </Text>
                <Text type="secondary">
                  Email: {userProfile.studentContacts[0].contactValue}
                </Text>
              </div>
              <div  style={{ display: 'flex', flexDirection: 'column', gap:'1rem' }}>
                <Text type="secondary">
                  Parent's Email: {userProfile.parentContacts[0].contactValue}
                </Text>
                <Text type="secondary">
                  Parent's Email: {userProfile.parentContacts[0].contactValue}
                </Text>
                <Text type="secondary">
                  Parent's Email: {userProfile.parentContacts[0].contactValue}
                </Text>
                <Text type="secondary">
                  Parent's Email: {userProfile.parentContacts[0].contactValue}
                </Text>
              </div>
            </Space>
          </div>
        )}
        <div style={{display:'flex', justifyContent:'flex-end', marginTop:'2rem'}}>
        <Button onClick={() => authStore.signOut()}>Sign Out</Button>
        </div>
      </Card>
    </Spin>
  );
};

export default GetProfile;
