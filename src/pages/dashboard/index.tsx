import { authStore } from "@/app/store/auth/auth.store";
import { Button } from "antd/lib";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { Content } from "antd/lib/layout/layout";
import Profile from "@/widgets/Dashboard/studentDashboard/Profile/Profile";
import Courses from "@/widgets/Dashboard/studentDashboard/Courses/Courses";
import { Layout, Menu } from "antd/lib";
import Sider from "antd/lib/layout/Sider";
import ClassCurator from "@/widgets/Dashboard/curatorDashboard/classes/ClassCurator";
import CourseCurator from "@/widgets/Dashboard/curatorDashboard/courses/CourseCurator";
import Classes from "@/widgets/Dashboard/studentDashboard/Classes/Classes";
import Requests from "@/widgets/Dashboard/studentDashboard/SentRequests/Requests";
import Certificates from "@/widgets/Dashboard/studentDashboard/Certificates/Certificates/Certificates";
import Letters from "@/widgets/Dashboard/studentDashboard/RecomendationLetters/Letters/Letters";
import IndividualClassRequests from "@/widgets/Dashboard/studentDashboard/IndividualClasses/IndividualClassRequests";
import StudentRequets from "@/widgets/Dashboard/curatorDashboard/studentRequests/StudentRequets";
import Session from "@/widgets/Dashboard/curatorDashboard/sessions/Session";
import { ClassTableMentor } from "@/widgets/Dashboard/mentorDashboard/classTable/ClassTable";
import MyProfile from "../api/my-profile";
import CreateProfile from "@/widgets/Dashboard/studentDashboard/Profile/CreateProfile";
import MentorProfiles from "../api/mentor-profiles";
import ProfileMentor from "@/widgets/Dashboard/mentorDashboard/Profile/Profile";

const Dashboard = observer(() => {
  const router = useRouter();
  const [userInfo, setUserInfo]: any = useState(null);

  useEffect(() => {
    if (!authStore.isAuth) {
      router.push("/login");
    } else {
      try {
        const token: any = localStorage.getItem("access_token_private");
        const decodedToken = jwt.decode(token);
        setUserInfo(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [authStore.isAuth, router]);

  if (!authStore.isAuth || !userInfo) {
    return <div>Loading...</div>;
  }

  let DashboardComponent;

  switch (userInfo.role) {
    case "student":
      DashboardComponent = <DashoardStudent />;
      break;
    case "mentor":
      DashboardComponent = <DashoardMentor />;
      break;
    case "curator":
      DashboardComponent = <DashoardCurator />;
      break;
    default:
      DashboardComponent = <div>Unknown role</div>;
  }

  return (
    <Layout style={{ height: "94vh" }}>
      <Sider trigger={null} collapsible>
        {DashboardComponent}
      </Sider>
    </Layout>
  );
});

export default Dashboard;

const DashoardStudent = () => {
  const [selectedItem, setSelectedItem] = useState<string>("1");
  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case "1":
        return <Profile />;
      case "2":
        return <Classes />;
      case "3":
        return <Courses />;
      case "4":
        return <Requests />;
      case "5":
        return <Certificates />;
      case "6":
        return <Letters />;
      case "7":
        return <IndividualClassRequests />;
      case "8":
        return <Requests />;
      default:
        return null;
    }
  };
  return (
    <div>
      <Layout style={{ height: "94vh" }}>
        <Sider trigger={null} collapsible>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedItem]}
            onClick={(e) => setSelectedItem(e.key)}
          >
            <Menu.Item key="1">Profile</Menu.Item>
            <Menu.Item key="7">Individual classes</Menu.Item>
            <Menu.Item key="8">My requests</Menu.Item>
            {/* <Menu.Item key="2">Applied Classes</Menu.Item> */}
            <Menu.Item key="3">Courses</Menu.Item>
            <Menu.Item key="5">Certificates</Menu.Item>
            <Menu.Item key="6">Recomendation letters</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ width: "80vw", padding: "20px" }}>
          {renderSelectedComponent()}
        </Content>
      </Layout>
    </div>
  );
};
const DashoardMentor = () => {
  const [selectedItem, setSelectedItem] = useState<string>("1");
  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case "1":
        return <ClassTableMentor />;
      case "2":
        return <ProfileMentor />;
      default:
        return null;
    }
  };
  return (
    <div>
      <Layout style={{ height: "94vh" }}>
        <Sider trigger={null} collapsible>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedItem]}
            onClick={(e) => setSelectedItem(e.key)}
          >
            <Menu.Item key="2">Profile</Menu.Item>
            <Menu.Item key="1">Classes</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ width: "80vw", padding: "20px" }}>
          {renderSelectedComponent()}
        </Content>
      </Layout>
    </div>
  );
};
const DashoardCurator = () => {
  const [selectedItem, setSelectedItem] = useState<string>("1");
  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case "1":
        return <CourseCurator />;
      case "2":
        return <ClassCurator />;
      case "3":
        return <StudentRequets />;
      case "4":
        return <Session />;
      default:
        return null;
    }
  };
  return (
    <div>
      <Layout style={{ height: "94vh" }}>
        <Sider trigger={null} collapsible>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedItem]}
            onClick={(e) => setSelectedItem(e.key)}
          >
            <Menu.Item key="1">Courses</Menu.Item>
            <Menu.Item key="2">Classes</Menu.Item>
            <Menu.Item key="3">Student individual requests</Menu.Item>
            <Menu.Item key="4">Session</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ width: "80vw", padding: "20px" }}>
          {renderSelectedComponent()}
        </Content>
      </Layout>
    </div>
  );
};

// import React from 'react';

// const index = () => {
//   return (
//     <div>

//     </div>
//   );
// };

// export default index;
