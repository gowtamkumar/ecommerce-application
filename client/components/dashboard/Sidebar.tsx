"use client";
import { Avatar, Drawer, Layout, Menu, Button, Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  selectLayout,
  setCollapsed,
  setOpen,
  setScreenWidth,
} from "@/redux/features/layout/layoutSlice";
import { navbarRoute } from "@/NavBarRoute";
import { getSettings } from "@/lib/apis/setting";

const { Sider } = Layout;

const Sidebar = () => {
  const [setting, setSetting] = useState<{ logo: string }>({ logo: "" });
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    function updateScreenWidth() {
      dispatch(setScreenWidth(window.innerWidth));
    }
    // Update screen width on mount
    updateScreenWidth();

    // Add event listener to update screen width on resize
    window.addEventListener("resize", updateScreenWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const logo = await getSettings();
      const singleLogo = logo.data ? logo.data[0]?.image : null;
      setSetting({ logo: singleLogo });
    })();
  }, []);

  const onClose = () => {
    dispatch(setOpen(false));
  };

  const checkPermission = (item: any) => {
    const isAdmin = true;
    if (isAdmin) return true;
    let access = false;
    if (item.route === "true") {
      access = true;
    }
    return access;
  };

  const filteredChildren = navbarRoute
    ?.filter((item: any) => checkPermission(item))
    .map((item: any) => ({
      ...item,
      children: item?.children?.filter((child: any) => checkPermission(child)),
    }));

  interface NavbarItem {
    key: string;
    label: string;
  }

  return (
    <div className="bg-[#001529]">
      <Drawer
        placement={"left"}
        onClose={onClose}
        open={layout.open}
        styles={{ body: { margin: 0, padding: 0 } }}
        extra={<Button onClick={onClose}>Close</Button>}
      >
        <Menu
          style={{ margin: 0, padding: 0 }}
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={onClose}
          items={navbarRoute as NavbarItem[]}
        />
      </Drawer>
      <Sider
        collapsible
        collapsed={layout.collapsed}
        onCollapse={(value) => dispatch(setCollapsed(value))}
        hidden={layout.screenWidth <= 820}
      >
        <div className="bg-slate-300 flex justify-center items-center p-1">
          {/* <Avatar alt="logo" size={40} src={
              setting?.logo
                ? `http://localhost:3900/uploads/${setting.logo}`
                : "/pos_software.png"
            } /> */}
          <Image
            src={
              setting?.logo
                ? `http://localhost:3900/uploads/${setting.logo}`
                : "/pos_software.png"
            }
            alt={setting?.logo}
            loading="lazy"
            width={50}
            height={50}
            // className="mx-auto h-5 w-auto"
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <Menu theme="dark" mode="inline" items={filteredChildren} />
      </Sider>
    </div>
  );
};

export default Sidebar;
