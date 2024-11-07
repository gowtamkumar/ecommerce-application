"use client";
import { Badge, Menu, MenuProps, Space } from "antd";
import Link from "next/link";
import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

type MenuItem = Required<MenuProps>["items"][number];

export default function MainMenu({
  responsiveMenu,
}: {
  responsiveMenu: string;
}) {
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const skinCareItemChilderes: MenuItem[] = [
    {
      label: "Navigation Two",
      key: "app",
      disabled: true,
    },
    {
      label: "Navigation One",
      key: "mail",
    },
    {
      key: "alipay",
      label: (
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          Navigation Four - Link
        </a>
      ),
    },
  ];

  const itemChilderes: MenuItem[] = [
    {
      label: "Navigation Two",
      key: "app",
      disabled: true,
    },
    {
      label: "Navigation One",
      key: "mail",
    },
    {
      key: "alipay",
      label: (
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          Navigation Four - Link
        </a>
      ),
    },
  ];

  const items: MenuItem[] = [
    {
      key: "1",
      label: "Home",

      // style: {
      //   paddingLeft: 0, //padding 0 only for desktop
      // },
      className: "menu-first-child",
    },
    {
      key: "skinCare",
      label: "Skin Care",
      children: [
        {
          key: "skinCareTreatment",
          label: "Skin Care Treatment",
          children: [
            {
              key: "8",
              label: (
                <Space
                  align="center"
                  direction={
                    responsiveMenu === "desktop" ? "horizontal" : "vertical"
                  }
                >
                  <Menu
                    items={skinCareItemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                    className="hover:underline"
                  />
                  <Menu
                    items={skinCareItemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                    className="hover:underline"
                  />
                  <Menu
                    items={skinCareItemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                    className="hover:underline"
                  />
                </Space>
              ),
              className: "mega-menu-tp",
              style: {
                height: "fit-content",
                padding: 0,
                backgroundColor: "white",
                // marginTop: "-4%",
              },
            },
          ],
        },
        {
          key: "skinCareProduct",
          label: "Skin Care Products",
          children: [
            {
              key: "97",
              label: (
                <Space
                  align="center"
                  direction={
                    responsiveMenu === "desktop" ? "horizontal" : "vertical"
                  }
                >
                  <div>
                    <Menu
                      items={itemChilderes}
                      style={{
                        boxShadow: "none",
                        border: "none",
                      }}
                      className="hover:underline"
                    />
                  </div>

                  <Menu
                    items={itemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                  <Menu
                    items={itemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                </Space>
              ),
              className: "mega-menu-tp",
              style: {
                height: "fit-content",
                padding: 0,
                backgroundColor: "white",
                // marginTop: "-4%",
              },
            },
          ],
        },
      ],
    },
    {
      key: "hairCare",
      label: "Hair Care",
      children: [
        {
          key: "skinCare3",
          label: "Hair Care Treatment",
          children: [
            {
              key: "88",
              label: (
                <Space
                  align="center"
                  direction={
                    responsiveMenu === "desktop" ? "horizontal" : "vertical"
                  }
                >
                  <Menu
                    items={skinCareItemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                    className="hover:underline"
                  />
                  <Menu
                    items={skinCareItemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                    className="hover:underline"
                  />
                  <Menu
                    items={skinCareItemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                    className="hover:underline"
                  />
                </Space>
              ),
              className: "mega-menu-tp",
              style: {
                height: "fit-content",
                padding: 0,
                backgroundColor: "white",
                // marginTop: "-4%",
              },
            },
          ],
        },
        {
          key: "hairCareProduct",
          label: "Hair Care Products",
          children: [
            {
              key: "77",
              label: (
                <Space
                  align="center"
                  direction={
                    responsiveMenu === "desktop" ? "horizontal" : "vertical"
                  }
                >
                  <div>
                    <Menu
                      items={itemChilderes}
                      style={{
                        boxShadow: "none",
                        border: "none",
                      }}
                      className="hover:underline"
                    />
                  </div>

                  <Menu
                    items={itemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                  <Menu
                    items={itemChilderes}
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                </Space>
              ),
              className: "mega-menu-tp",
              style: {
                height: "fit-content",
                padding: 0,
                backgroundColor: "white",
                // marginTop: "-4%",
              },
            },
          ],
        },
      ],
    },
    {
      key: "bodyCare",
      label: "Body Care",

      children: [
        {
          key: "999",
          label: (
            <Space
              align="center"
              direction={
                responsiveMenu === "desktop" ? "horizontal" : "vertical"
              }
            >
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
            </Space>
          ),
          className: "mega-menu-tp",
          style: {
            height: "fit-content",
            padding: 0,
            backgroundColor: "white",
            // marginTop: "-6%",
          },
        },
      ],
    },

    {
      key: "supplements",
      label: "Supplements",
      // icon: (
      //   <IoIosArrowDown className="float-right md:mt-4 ml-1  menu-custom-icon" />
      // ),
      children: [
        {
          key: "11",
          label: "Menstruation",
        },
        {
          key: "12",
          label: "Brightening",
        },
        {
          key: "13",
          label: "Vitamins",
        },
        {
          key: "14",
          label: "Weight Loss",
        },
        {
          key: "15",
          label: "Anti Aging",
        },
        {
          key: "16",
          label: "Constipation",
        },
      ],
    },

    {
      key: "smartLifeStyle",
      label: "Smart Life Style",

      children: [
        {
          key: "121",
          label: "H2CAP",
        },
        {
          key: "9",
          label: "Vitamin C shower",
        },
        {
          key: "10",
          label: "Dr. light UV Mirror",
        },
        {
          key: "111",
          label: "Hydrogen mist",
        },
        {
          key: "110",
          label: "UV Sterilization Smart Bottle T20",
        },
      ],
    },
    {
      key: "ingredients",
      label: "Ingredients",

      children: [
        {
          key: "99",
          label: (
            <Space
              align="center"
              direction={
                responsiveMenu === "desktop" ? "horizontal" : "vertical"
              }
            >
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
            </Space>
          ),
          className: "mega-menu-tp",
          style: {
            height: "fit-content",
            padding: 0,
            backgroundColor: "white",
            // marginTop: "-3%",
          },
        },
      ],
    },
    {
      key: "skinCareBrand",
      label: "Skin Care Brands",

      children: [
        {
          key: "91",
          label: (
            <Space
              align="center"
              direction={
                responsiveMenu === "desktop" ? "horizontal" : "vertical"
              }
            >
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
              <Menu
                items={itemChilderes}
                style={{ boxShadow: "none", border: "none" }}
              />
            </Space>
          ),
          className: "mega-menu-tp",
          style: {
            height: "fit-content",
            padding: 0,
            backgroundColor: "white",
            // marginTop: "-6%",
          },
        },
      ],
    },
  ];

  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode={responsiveMenu === "desktop" ? "horizontal" : "inline"}
        className="w-full bg-white  hover:bg-white p-0 m-0 font-semibold"
        items={items}
        style={{
          boxShadow: "none",
          border: "none",
          fontSize: "unset",
          fontFamily: "unset",
        }}
      />

      <div className="hidden md:block">
        <Link href="/profile" className="cursor-pointer md:hidden inline ">
          <Badge size="default">
            <CiHeart className="font-medium lg:text-lg text-2xl" />
          </Badge>
        </Link>

        <Link href="/checkout" className="mt-1 md:hidden inline">
          <Badge size="default" count={30}>
            <IoBagOutline className="font-medium lg:text-lg text-2xl" />
          </Badge>
        </Link>
      </div>
    </>
  );
}
