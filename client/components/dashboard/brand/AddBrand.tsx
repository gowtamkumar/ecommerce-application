/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Switch, Upload } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveBrand, updateBrand } from "@/lib/apis/brand";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import ImgCrop from "antd-img-crop";
import appConfig from "@/appConfig";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import uploadButton from "@/components/website/uploadButton";

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
    let newData = { ...values };

    const result = newData.id
      ? () => updateBrand(newData)
      : () => saveBrand(newData);

    await handleAsyncAction(result, dispatch);
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
        url: `${appConfig.baseApiUrl}/uploads/${filename || "no-data.png"}`,
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
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Brand" : "Create Brand"}
        </span>
      }
      width={550}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={() => resetFormData(payload)} className="!rounded-lg">
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!bg-black hover:!bg-gray-800 !rounded-lg !px-8"
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

        <div className="space-y-4">
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

          {/* Status */}
          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
            className="!mb-0"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
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
