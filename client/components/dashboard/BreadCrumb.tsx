import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

export default function BreadCrumb() {
  const pathname = usePathname();
  const routeer = useParams();
  console.log("🚀 ~ routeer:", routeer)

  const newResutl = pathname
    .split("/")
    .slice(1)
    .map((item) => ({ title: item }))
  return (
    <Breadcrumb
      style={{ margin: "5px 0" }}
      items={[{ title: <HomeOutlined /> }, ...newResutl]}
    />
  );
}
