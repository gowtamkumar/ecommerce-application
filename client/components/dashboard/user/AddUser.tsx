'use client'
import uploadButton from "@/components/share-component/uploadButton";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import { saveUser, updateUser } from "@/lib/apis/user";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";


const AddUser = () => {
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;

  const global = useSelector(selectGlobal);
  const { payload, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...global.action.payload };
    if (newData.dob) newData.dob = dayjs(newData.dob);
    form.setFieldsValue(newData);
    setFormValues(newData);
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateUser(values)
      : () => saveUser(values);

    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
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
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      form.setFieldsValue({
        fileList: [newFile],
        image: newFileName,
      });
      setFormValues((prev: any) => ({
        ...prev,
        fileList: [newFile],
        image: newFileName,
      }));
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update User" : "Create User"}
        </span>
      }
      width={700}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={() => resetFormData(payload)} style={{ borderRadius: "var(--button-border-radius)" }}>
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            loading={global.loading.save}
            disabled={global.loading.save}
            className="!px-8"
            style={{ 
              borderRadius: "var(--button-border-radius)",
              backgroundColor: "var(--global-primary)"
            }}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
        className="mt-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="John Doe" size="large" />
          </Form.Item>

          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Username is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="johndoe" size="large" disabled={payload?.id} />
          </Form.Item>
        </div>

        {!payload?.id && (
          <div className="mt-4">
            <Form.Item
              hidden={payload?.id}
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
              className="!mb-0"
            >
              <Input.Password placeholder="Enter secure password" size="large" />
            </Form.Item>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Email */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="john@example.com" size="large" />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            label="Phone Number"
            className="!mb-0"
          >
            <Input placeholder="+1 (555) 123-4567" size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* User Type */}
          <Form.Item name="type" label="User Type" className="!mb-0">
            <Select
              showSearch
              allowClear
              size="large"
              placeholder="Select user type"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as any)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {["Customer", "Vendor", "Delivery Man", "Admin"].map(
                (item, idx) => (
                  <Select.Option key={idx} value={item}>
                    {item}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          {/* Date of Birth */}
          <Form.Item name="dob" label="Date of Birth" className="!mb-0">
            <DatePicker
              placeholder="Select birth date"
              size="large"
              className="!w-full"
              format="DD-MM-YYYY"
            />
          </Form.Item>
        </div>

        <div className="mt-4">
          {/* Status */}
          <Form.Item
            name="status"
            label="Account Status"
            valuePropName="checked"
            className="!mb-0"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>
        </div>

        {/* Profile Image */}
        <div className="mt-4">
          <Form.Item
            name="fileList"
            label="Profile Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="!mb-0"
          >
            <ImgCrop rotationSlider showReset aspect={1}>
              <Upload
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
                onPreview={(file) => handlePreview(file, dispatch)}
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

        <Modal
          open={global.previewOpen}
          title={global.previewTitle}
          footer={null}
          onCancel={() => handlePreviewCancel(dispatch)}
        >
          <Image
            alt="example"
            style={{
              width: "100%",
            }}
            src={global.previewImage}
          />
        </Modal>
      </Form>
    </Modal>
  );
};

export default AddUser;
