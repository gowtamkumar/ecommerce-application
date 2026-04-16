"use client";
import uploadButton from "@/components/share-component/uploadButton";
import { brandsApi } from "@/constants/api";
import { Save, Update } from "@/lib/apis";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
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
import { TagsOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Modal, Select, Space, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const AddBrand = () => {
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
    setFormData(newData);
  }, [payload]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => Update({ url: `${brandsApi}/${values.id}`, body: values })
      : () => Save({ url: brandsApi, body: values });

    await handleAsyncAction(result, dispatch);
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

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    setFormValues({});
    form.resetFields();
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    setFormValues(form.getFieldsValue());
  };

  const resetFormData = (value: any) => {
    if (value?.id) {
      form.setFieldsValue(value);
      setFormValues(form.getFieldsValue());
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
    }
  };

  return (
    <Modal
      title={
        <Space className="text-xl font-semibold">
          <TagsOutlined className="text-orange-500" />
          <span>{type === ActionType.UPDATE ? "Update Brand" : "Create Brand"}</span>
        </Space>
      }
      width={550}
      zIndex={1050}
      open={
        type &&
        global?.action?.brand &&
        (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      centered
      maskClosable={false}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4">
          <Button
            size="large"
            onClick={() => resetFormData(payload)}
            style={{ borderRadius: "var(--button-border-radius)" }}
          >
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!h-10 !px-6 !font-medium"
            style={{
              borderRadius: "var(--button-border-radius)",
              backgroundColor: "var(--global-primary)",
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
        className="mt-6 space-y-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-6">
          {/* Name */}
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter brand name" size="large" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Status is required",
              },
            ]}
            className="!mb-0"
          >
            <Select placeholder="Select Status" size="large">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          {/* Image Upload */}
          <Form.Item
            name="fileList"
            label="Brand Logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="!mb-0"
          >
            <ImgCrop rotationSlider showReset aspect={16 / 9}>
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

export default AddBrand;
