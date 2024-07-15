"use client";
import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";

import { useRouter } from "next/navigation";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { getSession, signIn } from "next-auth/react";

const Login = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      if (session?.status === "authenticated") {
        router.replace("/");
      }
    })();
  }, [dispatch, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      let newData = { ...values };

      // return console.log("newData:", newData);
      const result = await signIn("credentials", {
        ...newData,
        redirect: false,
      });
      const getSesson: any = await getSession();
      console.log("🚀 ~ result:", result);

      if (getSesson?.user?.role === "Admin" && result?.status === 200) {
        router.push("/dashboard");
        return;
      }

      if (getSesson?.user?.role === "User" && result?.status === 200) {
        router.push("/");
        return;
      }

      setTimeout(async () => {
        console.log("🚀 ~ result:", result);
        console.log("🚀 ~ result:", result);
        dispatch(setLoading({ save: false }));
        // toast.success(
        //   `Address ${newData?.id ? "Updated" : "Created"} Successfully`
        // );
      }, 100);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8 bg-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Welcome to site! Please login.
            </h2>

            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input.Password placeholder="Enter " />
            </Form.Item>
            <Button
              // size="small"
              className="w-full"
              type="primary"
              htmlType="submit"
              // className="capitalize"
              loading={global.loading.save}
            >
              Login
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Login;
