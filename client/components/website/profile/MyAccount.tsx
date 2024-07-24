"use client";
import { updateUser } from "@/lib/apis/user";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  point: string;
  address: string;
  imgUrl: string;
}

export default function MyAccount({ user }: any) {
  const [edit, setEdit] = useState(false);
  console.log("🚀 ~ user:", user);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  // form.setFieldsValue(user);
  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id && (await updateUser(newData));

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData.dob) newData.dob = dayjs(newData.dob);
    if (newData?.id) {
      form.setFieldsValue(newData);
      dispatch(setFormValues(newData));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  return (
    <div className="py-10 w-1/2">
      <div className="flex justify-between">
        <div> Personal Information</div>
        <Button
          onClick={() => {
            const newData = { ...user };
            if (newData.dob) newData.dob = dayjs(user.dob);
            form.setFieldsValue(newData);
            setEdit(!edit);
          }}
          size="small"
        >
          {edit ? "View" : "Edit"}
        </Button>
      </div>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={user}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
          <Input placeholder="Enter name" disabled={!edit} />
        </Form.Item>
        <Form.Item name="username" label="Username">
          <Input placeholder="Enter" disabled />
        </Form.Item>
        {/* <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "password is required",
            },
          ]}
        >
          <Input.Password placeholder="Enter password" disabled={!edit} />
        </Form.Item> */}
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              message: "email is required",
            },
          ]}
        >
          <Input placeholder="Enter " disabled={!edit} />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Radio.Group disabled={!edit}>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone No"
          rules={[
            {
              required: true,
              message: "Phone is required",
            },
          ]}
        >
          <Input placeholder="Enter phone" disabled={!edit} />
        </Form.Item>

        <Form.Item name="dob" label="Date of Brith">
          <DatePicker placeholder="Enter Birth day" disabled={!edit} />
        </Form.Item>

        <Form.Item
          hidden={!global.action.payload?.id}
          name="status"
          label="Status"
        >
          <Select
            showSearch
            allowClear
            placeholder="Select Status"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            disabled={!edit}
          >
            <Select.Option value={"Active"}>Active</Select.Option>
            <Select.Option value={"Inactive"}>Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Button
          className="mx-2 capitalize"
          size="small"
          onClick={() => resetFormData(global.action?.payload)}
        >
          Reset
        </Button>
        <Button
          size="small"
          color="blue"
          htmlType="submit"
          className="capitalize"
          loading={global.loading.save}
        >
          {global.action.payload?.id ? "Update" : "Save"}
        </Button>
      </Form>
    </div>
  );
}
