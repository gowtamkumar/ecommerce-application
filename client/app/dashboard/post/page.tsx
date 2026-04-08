"use client";
import { ActionType } from "@/constants/constants";
import { setAction, selectGlobal } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/lib/apis/categories";

const PostList = dynamic(() => import("@/components/dashboard/post/PostList"), { ssr: false });
const AddPost = dynamic(() => import("@/components/dashboard/post/AddPost"), { ssr: false });

export default function Page() {
  const [tabKey, setTabKey] = useState("post_list");
  const [categories, setCategories] = useState([]);
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
    <div className="container-fluid bg-white p-3">
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
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  post: true,
                  type: ActionType.CREATE,
                })
              )
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
