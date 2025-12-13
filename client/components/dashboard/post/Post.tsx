"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddPost = dynamic(() => import('./AddPost'), { ssr: false })
const PostList = dynamic(() => import('./PostList'), { ssr: false })


export default function Post() {
  const [tabKey, setTabKey] = useState("post_list");
  const router = useRouter()

  return (
    <div className="container bg-white p-3">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Posts",
            key: "post_list",
            children: <PostList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            onClick={() =>
              router.push("/dashboard/post/new")
            }
          >
            <PlusOutlined className="mx-1" /> New Post
          </Button>
        }
      />
      <AddPost />
    </div>
  );
}
