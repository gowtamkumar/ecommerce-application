"use client";
import { saveUser } from "@/lib/apis/user";
import { selectGlobal, setLoading, setResponse } from "@/redux/features/global/globalSlice";
import { Alert, Button, Form, Input } from "antd";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

const Register = () => {
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        router.replace("/");
      }
    })();
  }, [dispatch, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      const result = await saveUser(values);

      if (result?.success) {
        dispatch(
          setResponse({ type: "success", message: "Account created successfully! Please login." })
        );
        router.push("/login");
      } else {
        dispatch(
          setResponse({ type: "error", message: result?.message || "Registration failed" })
        );
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        setResponse({ type: "error", message: "Something went wrong. Please try again." })
      );
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-12 border border-gray-100 backdrop-blur-sm bg-opacity-80">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us today! It only takes a minute.
            </p>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <Form.Item
                name="name"
                label={<span className="text-sm font-medium text-gray-700">Full Name</span>}
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  placeholder="John Doe"
                  size="large"
                  className="rounded-xl border-gray-300 focus:border-global-primary focus:ring-global-primary"
                  onInput={() => dispatch(setResponse({}))}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-sm font-medium text-gray-700">Email Address</span>}
                rules={[
                  { required: true, message: "E-mail is required" },
                  { type: "email", message: "Enter a valid email" }
                ]}
              >
                <Input
                  placeholder="john@example.com"
                  size="large"
                  className="rounded-xl border-gray-300 focus:border-global-primary focus:ring-global-primary"
                  onInput={() => dispatch(setResponse({}))}
                />
              </Form.Item>

              <Form.Item
                name="username"
                label={<span className="text-sm font-medium text-gray-700">Username</span>}
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input
                  placeholder="johndoe123"
                  size="large"
                  className="rounded-xl border-gray-300 focus:border-global-primary focus:ring-global-primary"
                  onInput={() => dispatch(setResponse({}))}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-sm font-medium text-gray-700">Password</span>}
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  size="large"
                  className="rounded-xl border-gray-300 focus:border-global-primary focus:ring-global-primary"
                  onInput={() => dispatch(setResponse({}))}
                />
              </Form.Item>
            </div>

            {global.response.type && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pb-2">
                <Alert
                  className="rounded-xl border-none font-medium"
                  message={global.response.message}
                  type={global.response.type}
                  showIcon
                />
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-global-primary/20 hover:shadow-xl hover:shadow-global-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
              loading={global.loading.save}
            >
              Create Account
            </Button>
          </Form>

          <p className="mt-10 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-global-primary hover:text-global-hover transition-colors underline underline-offset-4"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-global-primary/10 via-white to-transparent" />
        <Image
          src="/login_bg.png"
          alt="Background"
          fill
          className="object-cover grayscale"
        />
      </div>
    </div>
  );
};

export default Register;