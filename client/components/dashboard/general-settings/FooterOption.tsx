"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Upload, Image as AntImage } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import appConfig from "@/appConfig";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import {
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const FooterOption = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const initialData = React.useMemo(() => ({
    id: global.setting?.id,
    ...global.setting?.footerOption,
    ...global.setting?.socialLink,
  }), [global.setting]);

  useEffect(() => {
    form.setFieldsValue(initialData);
  }, [form, initialData]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const {
      id,
      copyRight,
      image,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
    } = values;

    const payload = {
      id,
      footerOption: { copyRight, image },
      socialLink: { facebookUrl, instagramUrl, linkedinUrl, twitterUrl },
    };

    try {
      const res = id
        ? await updateSetting(payload)
        : await saveSetting(payload);

      if (!res?.success) {
        errorNotification({ message: res?.message || "Operation failed" });
        return;
      }

      successNotification({ message: res.message });
    } catch (error: any) {
      errorNotification({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unexpected error",
      });
    } finally {
      setLoading(false);
      dispatch(setSetting({}));
      dispatch(setAction({}));
    }
  };

  const customUploadRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadFile(formData);
      const filename = res?.data?.[0]?.filename;
      if (!filename) throw new Error("No filename returned");

      const newFile = {
        uid: Date.now().toString(),
        name: `footer-${filename}`,
        status: "done",
        fileName: filename,
        url: `${appConfig.baseApiUrl}/uploads/${filename}`,
      };

      const newValues = {
        ...form.getFieldsValue(),
        fileList: [newFile],
        image: filename,
      };

      form.setFieldsValue(newValues);
      dispatch(setSetting({ ...global.setting, footerOption: newValues }));
      onSuccess("OK");
    } catch (err) {
      onError(err);
    }
  };

  const handleRemoveImage = async (file: any) => {
    const values = {
      ...form.getFieldsValue(),
      fileList: [],
      image: null,
    };
    form.setFieldsValue(values);
    dispatch(setSetting({ ...global.setting, footerOption: values }));

    if (file.fileName) {
      await fileDeleteWithPhoto({ filename: file.fileName });
    }
  };

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
  };

  return (
    <div className="container mx-auto">
      <Form
        form={form}
        layout="vertical"
        {...layout}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="copyRight"
          label="Copy Right"
          rules={[{ required: true, message: "Copy Right is required" }]}
        >
          <Input placeholder="Enter copy right text" />
        </Form.Item>

        {["facebookUrl", "instagramUrl", "linkedinUrl", "twitterUrl"].map(
          (field) => (
            <Form.Item
              key={field}
              name={field}
              label={`${field.replace("Url", "")} URL`}
            >
              <Input placeholder={`Enter ${field.replace("Url", "")} URL`} />
            </Form.Item>
          )
        )}

        <Form.Item
          name="fileList"
          label="Footer Payment Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="image"
            listType="picture-card"
            fileList={initialData.fileList?.length || []}
            customRequest={customUploadRequest}
            onPreview={(file) => handlePreview(file, dispatch)}
            onRemove={handleRemoveImage}
            maxCount={1}
          >
            {initialData.fileList?.length >= 1 ? null : uploadButton}
          </Upload>
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
          <AntImage
            alt="Preview"
            style={{ width: "100%" }}
            preview={false}
            src={global.previewImage}
          />
        </Modal>

        <Form.Item>
          <Button htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FooterOption;
