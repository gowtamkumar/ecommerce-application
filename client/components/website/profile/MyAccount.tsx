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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import ChangePassword from "./PasswordChange";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

export default function MyAccount({ user }: any) {
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    const newData = { ...user };
    if (newData.image) {
      const newfile = {
        uid: Math.random() * 1000 + "",
        name: `image ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.image,
        url: `http://localhost:3900/uploads/${newData.image || "no-data.png"}`,
      };
      newData.fileList = [newfile];
    }
    if (newData.dob) newData.dob = dayjs(newData.dob);
    form.setFieldsValue(newData);
    setFormValues(newData);
  }, [form, user]);

  // console.log("formValues", formValues);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values};
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = await updateUser(newData);

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
      // console.log("🚀 ~ result:", result);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setResponse({}));
      }, 100);
    } catch (err: any) {
      console.log(err);
    }
  };


  const resetFormData = (value: any) => {
    const newData = { ...value };
    dispatch(setLoading({ save: false }));
    dispatch(setResponse({}));
    setEdit(false);
    if (newData.dob) newData.dob = dayjs(newData.dob);
    if (newData?.id) {
      form.setFieldsValue(newData);
      setFormValues(newData)
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
    }
  };

  const customUploadRequest = async (options: any) => {
    const { filename, file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append(filename, file);

    try {
      const res = await uploadFile(formData);
      if (!res || !res.data) {
        throw new Error("Invalid response format");
      }
      const filename = res.data[0].filename;
      const newfile = {
        uid: Math.random() * 1000 + "",
        name: `image ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: filename,
        url: `http://localhost:3900/uploads/${filename || "no-data.png"}`,
      };
      const newFileName = res.data.length ? filename : null;
      // Assuming you're updating form data here:
      form.setFieldsValue({
        fileList: [newfile],
        image: newFileName,
      });
      setFormValues({
        ...formValues,
        fileList: [newfile],
        image: newFileName,
      });

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      onError({ err });
    }
  };

  const normFile = (e: { fileList: string }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // const handleCancel = () => setPreviewOpen(false);

  // file Preview
  // const handlePreview = async (file: any) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  //   setPreviewTitle(
  //     file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
  //   );
  // };

  // const getBase64 = (file: any) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });

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

      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        scrollToFirstError={true}
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
            name="fileList"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            tooltip="(PNG/JPG/JPEG/BMP, Max. 3MB)"
          >
            <ImgCrop rotationSlider>
              <Upload
                disabled={!edit}
                name="image"
                listType="picture-card"
                fileList={formValues?.fileList || []}
                onRemove={async (v) => {
                  if (v.fileName) {
                    form.setFieldsValue({ image: null, fileList: [] });
                    setFormValues({ image: null, fileList: [] });
                    const params = { filename: v.fileName };
                    await fileDeleteWithPhoto(params);
                  }
                }}
                className="avatar-uploader"
                // onPreview={handlePreview}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {formValues?.fileList?.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>
        </div>
        <Form.Item {...tailLayout}>
          <Button
            className="mx-2"
            size="small"
            type="default"
            onClick={() => resetFormData(formValues)}
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

      <ChangePassword />
    </div>
  );
}
