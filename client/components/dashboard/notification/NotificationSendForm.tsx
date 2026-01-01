"use client";
import { NOTIFICATION_TYPES } from "@/constants/constants";
import { sendPromotionalNotification } from "@/lib/apis/notification";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { Button, Card, Form, Input, Select } from "antd";
import { useState } from "react";

const { TextArea } = Input;

const NotificationSendForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await sendPromotionalNotification(values);
      if (res.success) {
        successNotification({
          message: "Promotional notifications sent successfully",
        });
        form.resetFields();
      } else {
        errorNotification({
          message: res.message || "Failed to send notifications",
        });
      }
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const type = Form.useWatch("type", form);

  return (
    <Card
      title="Send Promotional Notification"
      className="shadow-sm rounded-xl"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="type"
          label="Notification Type"
          initialValue="NewOffer"
        >
          <Select>
            {NOTIFICATION_TYPES.filter((type) =>
              ["NewOffer", "General", "Maintenance"].includes(type)
            ).map((type: any) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="e.g., Summer Sale is Live!" />
        </Form.Item>

        {type === "NewOffer" && (
          <Form.Item
            name="offerUrl"
            label="Offer URL"
            rules={[{ required: true, type: "url", message: "Please enter a valid URL" }]}
          >
            <Input placeholder="e.g., https://www.example.com/summer-sale" />
          </Form.Item>
        )}
        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: "Please enter a message" }]}
        >
          <TextArea rows={4} placeholder="e.g., Get 50% off on all items..." />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Send to All Users
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NotificationSendForm;
