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
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-50 pb-6">
        <div>
          <Title level={4} className="!mb-0 text-gray-900 font-black">Personal Info</Title>
          <Text type="secondary" className="text-xs sm:text-sm">Manage your profile details and preferences.</Text>
        </div>
        <Button
          type={edit ? "default" : "primary"}
          icon={edit ? <EyeOutlined /> : <EditOutlined />}
          onClick={() => setEdit(!edit)}
          className="items-center flex w-full sm:w-auto h-10 rounded-xl font-bold"
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
        className="premium-form"
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
                className="avatar-uploader-circle shadow-sm"
                showUploadList={{ showPreviewIcon: false }}
              >
                {formValues?.fileList?.length >= 1 ? null : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadOutlined className="text-xl mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Text type="secondary" className="text-[10px] mt-3 font-medium uppercase tracking-wider text-gray-400">PNG, JPG (Max 1MB)</Text>
        </div>

        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={<span className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="John Doe" disabled={!edit} size="large" className="rounded-xl h-12" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label={<span className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</span>}
              rules={[{ required: true, message: "E-mail is required", type: "email" }]}
            >
              <Input placeholder="name@example.com" disabled={!edit} size="large" className="rounded-xl h-12" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={<span className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</span>}
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input placeholder="+1 234..." disabled={!edit} size="large" className="rounded-xl h-12" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="dob" label={<span className="text-xs font-bold uppercase tracking-widest text-gray-500">Birthday</span>}>
              <DatePicker placeholder="Select date" disabled={!edit} className="w-full rounded-xl h-12" size="large" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="address" label={<span className="text-xs font-bold uppercase tracking-widest text-gray-500">Address</span>}>
              <Input.TextArea
                placeholder="Enter your address"
                disabled={!edit}
                rows={3}
                className="rounded-xl p-4 resize-none"
              />
            </Form.Item>
          </Col>
        </Row>

        {edit && (
          <div className="mt-8 flex justify-end pt-6 border-t border-gray-50">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={global.loading.save}
              disabled={global.loading.save}
              className="w-full sm:w-auto px-12 h-12 rounded-xl font-bold bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
