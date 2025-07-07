import React from "react";
import { Form, Input } from "antd";

export default function ProductTopSecton({ form }: any) {
  return (
    <div>
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
        <Input
          placeholder="Enter"
          onChange={(value) => {
            const slug = value.target.value
              .toLowerCase()
              .trim()
              .split(" ")
              .join("-");
            form.setFieldsValue({ slug });
          }}
        />
      </Form.Item>
      <Form.Item
        name="slug"
        label="Slug"
        rules={[
          {
            required: true,
            message: "Slug is required",
          },
        ]}
      >
        <Input placeholder="Enter" />
      </Form.Item>
      <Form.Item
        name="shortDescription"
        label="Short Description"
        rules={[
          {
            required: true,
            message: "Short Description is required",
          },
        ]}
      >
        <Input.TextArea placeholder="Enter" rows={8} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          {
            required: true,
            message: "Description is required",
          },
        ]}
      >
        <Input.TextArea placeholder="Enter" rows={10} />
      </Form.Item>
    </div>
  );
}
