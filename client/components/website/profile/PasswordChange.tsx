"use client";
import { updatePassword } from "@/lib/apis/user";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { KeyOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

export default function ChangePassword() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading({ savePassword: true }));
      const res = await updatePassword(values);
      if (res.success) {
        successNotification({ message: "Password updated successfully" });
        form.resetFields();
      } else {
        errorNotification({ message: res.message || "Failed to update password" });
      }
    } catch (err: any) {
      errorNotification({ message: err.message || "Something went wrong" });
    } finally {
      dispatch(setLoading({ savePassword: false }));
    }
  };

  return (
    <div className="flex justify-center items-start pt-6">
      <Card
        className="w-full max-w-lg shadow-sm"
        bordered={false}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-4">
            <LockOutlined className="text-xl" />
          </div>
          <Title level={4}>Change Password</Title>
          <Text type="secondary">Ensure your account is using a long, random password to stay secure.</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please enter your current password",
              },
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined className="text-gray-400" />}
              placeholder="Current Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: "Please enter a new password",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters"
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: "Please confirm your new password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={global.loading.savePassword}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
