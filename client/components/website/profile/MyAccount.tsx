"use client";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Upload
} from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fileDeleteWithPhoto } from "@/lib/apis/file";
import { getMe, updateUser } from "@/lib/apis/user";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import { imageUploadSizeFileValidation } from "@/lib/utils/imageUploadValidation";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import uploadButton from "../uploadButton";

export default function MyAccount() {
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState({ fileList: [] }) as any;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        const newData = { ...res.data };
        if (newData.image) {
          const newfile = await imageSetFile(newData.image);
          newData.fileList = [newfile];
        }
        if (newData.dob) newData.dob = dayjs(newData.dob);
        form.setFieldsValue(newData);
        setFormValues(newData);
      } catch (err) {
        errorNotification({ message: "Failed to fetch user data." });
      }
    };
    fetchUser();
  }, [form]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      const result = await updateUser(values);
      if (result.success) {
        successNotification({ message: result.message });
      } else {
        errorNotification({ message: result.message });
      }
    } catch (err) {
      errorNotification({ message: "Something went wrong while updating." });
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };





  const customUploadRequest = async (options: any) => {
    const { file } = options;
    if (!imageUploadSizeFileValidation(file)) {
      form.setFieldsValue({ image: null, fileList: [] });
      setFormValues({ image: null, fileList: [] });
      return;
    }

    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      const updatedValues = {
        ...formValues,
        fileList: [newFile],
        image: newFileName,
      };
      form.setFieldsValue(updatedValues);
      setFormValues(updatedValues);
    }
  };

  const handleRemove = async (file: any) => {
    try {
      if (file.fileName) {
        await fileDeleteWithPhoto({ filename: file.fileName });
        form.setFieldsValue({ image: null, fileList: [] });
        setFormValues({ image: null, fileList: [] });
      }
    } catch {
      errorNotification({ message: "Failed to delete image." });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-2 pb-10">
        <p>Personal Information</p>
        <Button
          icon={edit ? <EyeOutlined /> : <EditOutlined />}
          title="Edit Profile"
          onClick={() => setEdit(!edit)}
          size="small"
        />
      </div>

      <div className="md:w-1/2">
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          scrollToFirstError
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter name" disabled={!edit} />
          </Form.Item>

          <Form.Item name="username" label="Username">
            <Input placeholder="Enter" disabled />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[{ required: true, message: "E-mail is required" }]}
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
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input placeholder="Enter phone" disabled={!edit} />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter" disabled={!edit} />
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth">
            <DatePicker placeholder="Enter" disabled={!edit} />
          </Form.Item>

          {global.action.payload?.id && (
            <Form.Item name="status" label="Status">
              <Select
                showSearch
                allowClear
                placeholder="Select Status"
                optionFilterProp="children"
                disabled={!edit}
              >
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="fileList"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            tooltip="(PNG/JPG/JPEG/BMP, Max. 1MB)"
          >
            <ImgCrop rotationSlider>
              <Upload
                disabled={!edit}
                name="image"
                listType="picture-card"
                fileList={formValues?.fileList || []}
                onRemove={handleRemove}
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

          <Form.Item>
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              loading={global.loading.save}
              disabled={global.loading.save}
            >
              {global.action.payload?.id ? "Update" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
