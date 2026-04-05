import {
  selectGlobal,
  setLoading,
  setResponse,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import { Alert, Button, Form, Input, Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import { fetchCartData } from "@/lib/utils/cart";
import { replaceCart } from "@/redux/features/cart/cartSlice";

export default function ModalLogin() {
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setUnAuthorize(false));
  };

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading({ save: true }));
      const newData = { ...values };
      const result: any = await signIn("credentials", {
        ...newData,
        redirect: false,
      });

      if (result?.error) {
        dispatch(setResponse({ type: "error", message: result.error }));
        dispatch(setLoading({ save: false }));
        return;
      }

      fetchCartData().then((cart: any) => {
        dispatch(replaceCart(cart)); // ✅ Sync cart with Redux
      });

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setUnAuthorize(false));
      }, 100);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Modal
      title={null}
      width={500}
      open={global.unAuthorize}
      onCancel={handleClose}
      footer={null}
    >
      <div className="p-16">
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          scrollToFirstError={true}
        >
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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
          {global.response.type && (
            <div className="mb-2">
              <Alert
                message={`${global.response.message}`}
                type={global.response.type}
              />
            </div>
          )}
          <Button
            className="w-full"
            type="primary"
            htmlType="submit"
            loading={global.loading.save}
          >
            Login
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
