"use client";
import { navbarRoute } from "@/NavBarRoute";
import {
  selectLayout,
  setCollapsed,
  setOpen,
  setScreenWidth,
} from "@/redux/features/layout/layoutSlice";
import { Button, Drawer, Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderLogo from "../website/header/Logo";

const { Sider } = Layout;

const Sidebar = () => {
  // const [setting, setSetting] = useState<{ logo: string }>({ logo: "" });
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();
  const route = useRouter();

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

  // useEffect(() => {
  //   (async () => {
  //     const setting = await getSettings();
  //     dispatch(setSetting(setting.data));
  //   })();
  // }, []);

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
          items={navbarRoute as any}
        />
      </Drawer>
      <Sider
        collapsible
        collapsed={layout.collapsed}
        onCollapse={(value) => dispatch(setCollapsed(value))}
        hidden={layout.screenWidth <= 820}
      >
        <div
          className="bg-slate-300 flex justify-center items-center p-1 cursor-pointer"
          onClick={() => {
            route.push("/");
          }}
        >
          <HeaderLogo />
        </div>
        <Menu theme="dark" mode="inline" items={filteredChildren} />
      </Sider>
    </div>
  );
};

export default Sidebar;
