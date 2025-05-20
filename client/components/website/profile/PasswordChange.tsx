import { Alert, Button, Divider, Form, Input } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";
import { updatePassword } from "@/lib/apis/user";
import { EditOutlined } from "@ant-design/icons";

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

  return (
    <div className="container">
      <div className="flex justify-between items-center gap-2">
        <Divider orientation="left" className="flex justify-between">
          <h3>Change Password</h3>
          {global.response.type && (
            <Alert
              className="p-0 m-0"
              message={`${global.response.message}`}
              type={global.response.type}
            />
          )}
        </Divider>

        <div hidden={changePassword}>
          <Button
            onClick={() => setChangePassword(true)}
            icon={<EditOutlined />}
            size="small"
          />
        </div>
      </div>

      <div className="md:w-1/2">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          autoComplete="off"
          scrollToFirstError={true}
        >
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

          <Form.Item>
            <div className="flex gap-2">
              <Button size="small" onClick={resetFormData} className="me-2">
                Reset
              </Button>
              <Button
                size="small"
                type="primary"
                htmlType="submit"
                loading={global.loading.savePassword}
              >
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
