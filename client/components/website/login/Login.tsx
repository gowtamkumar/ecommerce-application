"use client";
import React, { useEffect } from "react";
import { Alert, Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { getSession, signIn } from "next-auth/react";
import { fetchCartData } from "@/lib/utils/cart";
import { replaceCart } from "@/redux/features/cart/cartSlice";

const Login = () => {
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      if (session?.token) {
        router.replace("/");
      }
    })();
  }, [dispatch, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      const result: any = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        dispatch(
          setResponse({ type: "error", message: "Invalid Login Credentials" })
        );
        dispatch(setLoading({ save: false }));
        return;
      }

      // Wait for session to reflect login — loop check or force reload
      const checkSession = async (): Promise<any> => {
        for (let i = 0; i < 10; i++) {
          const session = await getSession();
          if (session?.user) return session;
          await new Promise((r) => setTimeout(r, 300));
        }
        return null;
      };

      const session = await checkSession();

      if (!session?.user) {
        dispatch(
          setResponse({
            type: "error",
            message: "Login succeeded but session failed",
          })
        );
        dispatch(setLoading({ save: false }));
        return;
      }

      // Load user cart
      const cart = await fetchCartData();
      dispatch(replaceCart(cart));

      // Navigate based on user role
      if (session.user.role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      dispatch(setResponse({ type: "error", message: "Something went wrong" }));
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const handleGoolgeLogin = async () => {
    const result = await signIn("google", {
      callbackUrl: `${window.location.origin}`,
    });
    // const getSesson: any = await getSession();
    // console.log("🚀 ~ getSesson:", getSesson)
  };

  const handleFacebookLogin = async () => {
    const result = await signIn("facebook");

    console.log("🚀 ~ result:", result);
    // const getSesson: any = await getSession();
    // console.log("🚀 ~ getSesson:", getSesson)
  };

  return (
    <div className="text-cetner">
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to site! Please login.
          </h2>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
            scrollToFirstError={true}
          >
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
              <Input
                placeholder="Enter "
                onInput={() => dispatch(setResponse({}))}
              />
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
              <Input.Password
                placeholder="Enter "
                onInput={() => dispatch(setResponse({}))}
              />
            </Form.Item>
            {global.response.type && (
              <div className="pb-3">
                <Alert
                  className="m-0"
                  message={`${global.response.message}`}
                  type={global.response.type}
                />
              </div>
            )}
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
          </Form>
          <Button className="w-full my-2" onClick={handleGoolgeLogin}>
            Google
          </Button>
          <Button className="w-full" onClick={handleFacebookLogin}>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
