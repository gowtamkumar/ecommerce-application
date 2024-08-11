import { Alert, Button, Divider, Form, Input } from "antd";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";

import { updatePassword } from "@/lib/apis/user";

export default function ChangePassword() {
  const [changePassword, setChangePassword] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ savePassword: true }));
      const res = await updatePassword(newData);
      if (res.success) {
        dispatch(
          setResponse({
            type: "success",
            message: "Password update successfully",
          })
        );
        dispatch(setLoading({ savePassword: false }));
      } else {
        dispatch(setResponse({ type: "error", message: res.message }));
        dispatch(setLoading({ savePassword: false }));
      }

      setTimeout(async () => {
        dispatch(setResponse({}));
      }, 5000);
    } catch (err: any) {
      console.log(err);
    }
  };


  const resetFormData = () => {
    form.resetFields();
    setChangePassword(false);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 5, span: 12 },
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center gap-2">
        <Divider orientation="left">
          <div>
            <h3>Change Password</h3>{" "}
          </div>
          {global.response.type && (
            <Alert
              className="p-0 m-0"
              message={`${global.response.message}`}
              type={global.response.type}
            />
          )}
        </Divider>

        <div hidden={changePassword}>
          <Button onClick={() => setChangePassword(true)} size="small">
            Change Password
          </Button>
        </div>
      </div>

      <Form
        {...layout}
        form={form}
        onFinish={(values) => handleSubmit(values)}
        autoComplete="off"
        scrollToFirstError={true}
      >
        {/* <Form.Item name="id" hidden className="m-2">
          <Input />
        </Form.Item> */}

        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            {
              required: true,
              message: "Current Password is required",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter Current Password"
            disabled={!changePassword}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: "New Password is required",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter New Password"
            disabled={!changePassword}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            {
              required: true,
              message: "Confirm Password is required",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                } else if (getFieldValue("newPassword").length < 8) {
                  return Promise.reject(
                    "Password must contain at least 8 characters"
                  );
                } else {
                  return Promise.reject("Password's does not match");
                }
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Enter Confirm Password"
            disabled={!changePassword}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button size="small" onClick={resetFormData} className="me-2">
            Reset
          </Button>
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            loading={global.loading.savePassword}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
