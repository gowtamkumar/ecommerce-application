"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { getCategories } from "@/lib/apis/categories";

const AddPost = dynamic(() => import('./AddPost'), { ssr: false })
const PostList = dynamic(() => import('./PostList'), { ssr: false })


export default function Post() {
  const [tabKey, setTabKey] = useState("post_list");
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategories(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCloseDrawer = () => {
    dispatch(setAction({}));
  };

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
      
      <Drawer
        title={global.action?.payload?.id ? "Edit Post" : "Create Post"}
        size="80%"
        open={global.action?.post}
        onClose={handleCloseDrawer}
        destroyOnClose
      >
        <AddPost categories={categories} />
      </Drawer>
    </div>
  );
}
