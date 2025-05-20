"use client";
import React, { useEffect, useState } from "react";
import { getMe, updateUser } from "@/lib/apis/user";
import {
  selectGlobal,
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
  message,
  Radio,
  Select,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import appConfig from "@/appConfig";
import dynamic from "next/dynamic";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

const ChangePassword = dynamic(() => import("./PasswordChange"), {
  ssr: false,
});

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

export default function MyAccount() {
  const [user, setUser] = useState({} as any);
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    feathUser();
  }, []);

  const feathUser = async () => {
    const res = await getMe();
    const newData = { ...res.data };

    if (newData.image) {
      const newfile = {
        uid: Math.random() * 1000 + "",
        name: `image ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.image,
        url: `${appConfig.baseApiUrl}/uploads/${newData.image || "no-data.png"
          }`,
      };
      newData.fileList = [newfile];
    }
    if (newData.dob) newData.dob = dayjs(newData.dob);
    form.setFieldsValue(newData);
    setFormValues(res);
    setUser(newData);
  };

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = await updateUser(values);

      if (result.success) {
        successNotification({ message: result.message });
      }

      if (!result.success) {
        errorNotification({ message: result.message });
        dispatch(setLoading({ save: false }));
      }

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
      }, 100);
    } catch (err: any) {
      dispatch(setLoading({ save: false }));
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
      setFormValues(newData);
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
      console.log("res", res);
      
      if (!res || !res.data) {
        errorNotification({ message: "Invalid response format" });
      }
      const filename = res.data[0].filename;
      const newfile = {
        uid: Math.random() * 1000 + "",
        name: `image ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: filename,
        url: `${appConfig.baseApiUrl}/uploads/${filename || "no-data.png"}`,
      };
      const newFileName = res.data.length ? filename : null;
      // Assuming you're updating form data here:
      form.setFieldsValue({
        ...formValues,
        fileList: [newfile],
        image: newFileName,
      });
      setFormValues({
        ...formValues,
        fileList: [newfile],
        image: newFileName,
      });

      onSuccess("Ok");
    } catch (err: any) {
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

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 12 },
  };
  const tailLayout = {
    wrapperCol: { offset: 5, span: 12 },
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-2 pb-10">
        <p> Personal Information</p>
        <div hidden={edit}>
          <Button
            icon={<EditOutlined />}
            title="Edit Profile"
            onClick={() => {
              const newData = { ...user };
              if (newData.dob) newData.dob = dayjs(user.dob);
              form.setFieldsValue(newData);
              setEdit(true);
            }}
            size="small"
          />
        </div>
      </div>

      <div className="md:w-1/2">
        <Form
          layout="vertical"
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
            <Input placeholder="Enter" disabled={!edit} />
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

          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter " disabled={!edit} />
          </Form.Item>

          <Form.Item name="dob" label="Date of Brith">
            <DatePicker placeholder="Enter" disabled={!edit} />
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
            <div className="flex gap-2">
              <Button
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
                disabled={global.loading.save}
              >
                {global.action.payload?.id ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
