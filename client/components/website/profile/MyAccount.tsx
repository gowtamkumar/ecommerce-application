"use client";
import { updateUser } from "@/lib/apis/user";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";
import {
  Alert,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ChangePassword from "./PasswordChange";
import { getSession } from "next-auth/react";

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

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  if (user.dob) user.dob = dayjs(user.dob);
  form.setFieldsValue(user);
  const handleSubmit = async (values: any) => {
    const session = await getSession();
    console.log("🚀 ~ session:", session?.user.id);
    try {
      let newData = { ...values, id: session?.user.id };

      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id && (await updateUser(newData));

      if (result.success) {
        dispatch(
          setResponse({
            type: "success",
            message: "Profile update successfully",
          })
        );
        dispatch(setLoading({ saveProfile: false }));
      } else {
        dispatch(setResponse({ type: "error", message: result.message }));
        dispatch(setLoading({ saveProfile: false }));
        dispatch(setLoading({ save: false }));
      }
      console.log("🚀 ~ result:", result);

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setResponse({}));
      }, 100);
    } catch (err: any) {
      console.log(err);
    }
  };

  // const handleClose = () => {
  //   dispatch(setAction({}));
  //   dispatch(setLoading({}));
  // };

  // const setFormData = (v: any) => {
  //   const newData = { ...v };
  //   form.setFieldsValue(newData);
  //   dispatch(setFormValues(form.getFieldsValue()));
  // };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    dispatch(setLoading({ save: false }));
    dispatch(setResponse({}));
    setEdit(false);
    if (newData.dob) newData.dob = dayjs(newData.dob);
    if (newData?.id) {
      form.setFieldsValue(newData);
      dispatch(setFormValues(newData));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  const tailLayout = {
    wrapperCol: { offset: 5, span: 12 },
  };
  return (
    <div className="py-10">
      <div className="flex justify-between items-center gap-2">
        <Divider orientation="left"> Personal Information</Divider>
        <div hidden={edit}>
          <Button
            onClick={() => {
              const newData = { ...user };
              if (newData.dob) newData.dob = dayjs(user.dob);
              form.setFieldsValue(newData);
              setEdit(true);
            }}
            size="small"
          >
            Change Information
          </Button>
        </div>
      </div>
      {global.response.type && (
        <Alert
          className="p-0 m-0"
          message={`${global.response.message}`}
          type={global.response.type}
        />
      )}
      <div>
        <Form
          {...layout}
          form={form}
          onFinish={handleSubmit}
          onValuesChange={(_v, values) => dispatch(setFormValues(values))}
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
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: "E-mail is required",
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
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <div>
            <Form.Item
              name="imgUrl"
              label="Photo"
              tooltip="(PNG/JPG/JPEG/BMP, Max. 3MB)"
            >
              <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>
          <Form.Item {...tailLayout}>
            <Button
              className="mx-2"
              size="small"
              type="default"
              onClick={() => resetFormData(global.action?.payload)}
            >
              Reset
            </Button>
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              loading={global.loading.save}
            >
              {global.action.payload?.id ? "Update" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* section password */}

      {/* <div className="flex justify-between items-center gap-2">
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
      </div> */}

      <ChangePassword />
    </div>
  );
}
