import { Button, Divider, Form, Input } from "antd";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { getSession } from "next-auth/react";

export default function ChangePassword() {
  const [changePassword, setChangePassword] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  // mutations

  // effect hook
  // useEffect(() => {
  //   setLoading({ ...loading, tableData: true });
  //   form.setFieldsValue({ id: id });
  //   return () => {
  //     resetFormData();
  //   };
  // }, []);

  const handleSubmit = async (values: any) => {
    const session = await getSession();
    try {
      let newData = { ...values, id: session?.user.id };

      return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      // const result = newData.id && (await updateUser(newData));

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      console.log(err);
    }
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
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
    wrapperCol: { offset: 4, span: 12 },
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center gap-2">
        <Divider orientation="left">
          <div>
            <h3>Change Password</h3>{" "}
          </div>
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
        <Form.Item name="id" hidden className="m-2">
          <Input />
        </Form.Item>

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
            loading={global.loading.save}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
