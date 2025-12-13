"use client";
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
import { EditOutlined, EyeOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
  Upload
} from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

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
        setEdit(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <div>
          <Title level={3} style={{ margin: 0 }}>Personal Information</Title>
          <Text type="secondary">Manage your personal details and preferences.</Text>
        </div>
        <Button
          type={edit ? "default" : "primary"}
          icon={edit ? <EyeOutlined /> : <EditOutlined />}
          onClick={() => setEdit(!edit)}
          className="items-center flex"
        >
          {edit ? "View Mode" : "Edit Profile"}
        </Button>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        scrollToFirstError
        requiredMark={edit ? "optional" : false}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="image" hidden>
          <Input />
        </Form.Item>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center justify-center mb-10">
          <Form.Item
            name="fileList"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            className="mb-0"
          >
            <ImgCrop rotationSlider showGrid showReset quality={0.8} aspect={1}>
              <Upload
                disabled={!edit}
                name="image"
                listType="picture-card"
                fileList={formValues?.fileList || []}
                onRemove={handleRemove}
                customRequest={customUploadRequest}
                maxCount={1}
                className="avatar-uploader-circle"
                showUploadList={{ showPreviewIcon: false }}
              >
                {formValues?.fileList?.length >= 1 ? null : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadOutlined className="text-xl mb-1" />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Text type="secondary" className="text-xs mt-2">Allowed: PNG, JPG, JPEG (Max 1MB)</Text>
        </div>

        <Row gutter={[24, 16]}>
          {/* Column 1 */}
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="Enter your full name" disabled={!edit} size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "E-mail is required", type: "email" }]}
            >
              <Input placeholder="name@example.com" disabled={!edit} size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input placeholder="+1 234 567 890" disabled={!edit} size="large" />
            </Form.Item>

            <Form.Item name="gender" label="Gender">
              <Radio.Group disabled={!edit} className="w-full">
                <div className="flex gap-4">
                  <Radio value="Male" className="border px-4 py-2 rounded-lg flex-1 text-center hover:bg-gray-50 transition-colors">Male</Radio>
                  <Radio value="Female" className="border px-4 py-2 rounded-lg flex-1 text-center hover:bg-gray-50 transition-colors">Female</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* Column 2 */}
          <Col xs={24} md={12}>
            <Form.Item name="username" label="Username">
              <Input placeholder="username" disabled size="large" className="bg-gray-50 text-gray-500" />
            </Form.Item>

            <Form.Item name="dob" label="Date of Birth">
              <DatePicker placeholder="Select date" disabled={!edit} className="w-full" size="large" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input.TextArea
                placeholder="Enter your delivery address"
                disabled={!edit}
                rows={4}
                className="resize-none"
              />
            </Form.Item>

            {global.action.payload?.id && (
              <Form.Item name="status" label="Status">
                <Select
                  disabled={!edit}
                  size="large"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        {edit && (
          <div className="mt-6 flex justify-end pt-6 border-t border-gray-100">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={global.loading.save}
              disabled={global.loading.save}
              className="px-8"
            >
              {global.action.payload?.id ? "Update Profile" : "Save Changes"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
