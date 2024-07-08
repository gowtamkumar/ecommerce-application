"use client";
import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";

import { useRouter } from "next/navigation";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { getSession, signIn } from "next-auth/react";
import { saveUser } from "@/lib/apis/user";

const Register = () => {
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      console.log("🚀 ~ session:", session)
      if (session) {
        router.replace("/");
      }
    })();
  }, [dispatch, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      // return console.log("newData:", newData);
      const result = await saveUser(values);

      if (result?.success) {
        router.push("/login");
      }


      setTimeout(async () => {
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
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-6 lg:px-8 bg-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Welcome to site! Create your Account.
            </h2>
            <div className="flex gap-3">
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input placeholder="Enter " />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    required: true,
                    message: "E-mail is required",
                  },
                ]}
              >
                <Input placeholder="Enter " />
              </Form.Item>
            </div>

            <div>
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
            </div>

            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              loading={global.loading.save}
            >
              Register
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Register;
