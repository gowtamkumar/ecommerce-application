import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveUser, updateUser } from "@/lib/apis/user";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import { PlusOutlined } from "@ant-design/icons";
import appConfig from "@/appConfig";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";

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
    const newData = { ...payload };
    if (newData.dob) newData.dob = dayjs(newData.dob);
    setFormData(newData);
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {

    const result = values.id
      ? () => updateUser(values)
      : () => saveUser(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (value: any) => {
    form.setFieldsValue(value);
    setFormValues(form.getFieldsValue());
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
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: filename,
        url: `${appConfig.apiUrl}/uploads/${filename || "no-data.png"}`,
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update User" : "Create User"}
      width={650}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
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
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: "username is required",
            },
          ]}
        >
          <Input placeholder="Enter" disabled={payload?.id} />
        </Form.Item>

        {!payload?.id && (
          <Form.Item
            hidden={payload?.id}
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "password is required",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

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
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Select
            showSearch
            allowClear
            placeholder="Select"
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

        <Form.Item name="phone" label="Phone No">
          <Input placeholder="Enter phone" />
        </Form.Item>

        <Form.Item name="dob" label="Date of Brith">
          <DatePicker placeholder="Enter Birth day" />
        </Form.Item>

        <Form.Item name="status" label="Status">
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
          >
            <Select.Option value={"Active"}>Active</Select.Option>
            <Select.Option value={"Inactive"}>Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fileList"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <ImgCrop rotationSlider showReset>
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
              onPreview={() => handlePreview(fileDeleteWithPhoto, dispatch)}
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

        <Form.Item {...tailLayout}>
          <Button
            className="me-2"
            size="small"
            onClick={() => resetFormData(payload)}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUser;
