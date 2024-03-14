"use client";
import { Avatar, Drawer, Layout, Menu, Button } from "antd";
import { navbarRoute } from "./NavBarRoute";
import Image from "next/image";

const { Sider } = Layout;

const checkPermission = (item: any) => {
  const isAdmin = false;
  if (isAdmin) return true;
  let access = false;
  if (item.route) {
    access = true;
  }
  return access;
};

const filteredChildren = navbarRoute
  ?.filter((item) => checkPermission(item))
  .map((item: any) => ({
    ...item,
    children: item?.children?.filter((child: any) => checkPermission(child)),
  }));

const Sidebar = ({
  setCollapsed,
  collapsed,
  screenWidth,
  onClose,
  open,
}: any) => {
  return (
    <div className="bg-[#001529]">
      <Drawer
        placement={"left"}
        onClose={onClose}
        open={open}
        styles={
          { body: { margin: 0, padding: 0 } }
        }
        extra={<Button onClick={onClose}>Close</Button>}
      >
        <Menu
          style={{ margin: 0, padding: 0 }}
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={onClose}
          items={navbarRoute}
        />
      </Drawer>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        hidden={screenWidth <= 820}
      // style={{ background: 'white' }}
      >
        <div className="bg-slate-300 flex justify-center items-center">
          <Image
            width={150}
            height={35}
            // placeholder="blur"
            alt="logo"
            src="/ict-garage.jpg"
          />
        </div>
        <Menu
          theme="dark"
          // defaultSelectedKeys={["1"]}
          mode="inline"

          items={filteredChildren}
        />
      </Sider>
    </div>
  );
};

export default Sidebar;
