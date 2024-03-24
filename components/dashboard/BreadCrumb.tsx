import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function BreadCrumb() {
  const pathname = usePathname();

  const newResutl = pathname
    .split("/")
    .slice(1)
    .map((item) => ({ title: item }))
  return (
    <Breadcrumb
      style={{ margin: "5px 0" }}
      items={[{ title: <HomeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> }, ...newResutl]}
    />
  );
}
