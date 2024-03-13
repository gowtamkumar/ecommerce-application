"use client";
import {
  AntDesignOutlined,
  DesktopOutlined,
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { DrawerProps, MenuProps, RadioChangeEvent } from "antd";
import {
  Avatar,
  Breadcrumb,
  Button,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { useLayoutEffect, useState } from "react";
import "../styles/antd.css";
import Image from "next/image";
import FooterOption from "./Footer";
const { Header, Content, Footer, Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //   const screenWidth = window.innerWidth;
  useLayoutEffect(() => {
    function updateScreenWidth() {
      setScreenWidth(window.innerWidth);
    }

    // Update screen width on mount
    updateScreenWidth();

    // Add event listener to update screen width on resize
    window.addEventListener("resize", updateScreenWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
      icon: <UserOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Drawer
        placement={"left"}
        // width={500}
        onClose={onClose}
        open={open}
        extra={<Button onClick={onClose}>Cancel</Button>}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        hidden={screenWidth <= 820}
      >
        <div className="bg-slate-300 flex justify-center items-center">
          <Avatar
            size={50}
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "1",
              // icon: <UserOutlined />,
              label: "Report",
              disabled: true,
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
              children: [
                {
                  key: "01",
                  icon: <UserOutlined />,
                  label: "nav 1",
                },
                {
                  key: "02",
                  icon: <VideoCameraOutlined />,
                  label: "nav 2",
                },
                {
                  key: "03",
                  icon: <UserOutlined />,
                  label: "nav 1",
                },
                {
                  key: "04",
                  icon: <VideoCameraOutlined />,
                  label: "nav 2",
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* this button show only desktop a  */}
          <Button
            type="text"
            title="Dasktop"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            hidden={screenWidth < 820}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          {/* this button show only Mobile a  */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={showDrawer}
            hidden={screenWidth > 820}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items }} placement="bottomLeft" trigger={["click"]}>
            <Avatar
              className="cursor-pointer"
              size={{ xs: 24, sm: 25, md: 30, lg: 40, xl: 40, xxl: 100 }}
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
            />
          </Dropdown>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 10,
              minHeight: "74vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
        <FooterOption />
      </Layout>
    </Layout>
  );
};

export default Sidebar;
