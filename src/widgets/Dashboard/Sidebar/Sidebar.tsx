import { Layout, Menu } from "antd/lib";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: "94vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: "Profile",
            },
            {
              key: "2",
              label: "nav 2",
            },
            {
              key: "3",
              label: "nav 3",
            },
          ]}
        />
      </Sider>
   
    </Layout>
  );
};

export default Sidebar;
