"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import ImgCrop from "antd-img-crop";

import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  handlePreview,
  normFile,
} from "@/lib/utils/commonFunctions";
import {
  fileDeleteWithPhoto,
  uploadFile,
} from "@/lib/apis/file";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import uploadButton from "@/components/website/uploadButton";

// Layout definition (static)
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};

const Seo = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const global = useSelector(selectGlobal);

  // Combine setting values
  const helpSupport = {
    id: global.setting.id,
    ...global.setting.seo,
    ...global.setting.homePage,
  };

  // Populate form on setting change
  useEffect(() => {
    form.setFieldsValue(helpSupport);
  }, [global.setting]);

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setLoading(true);

    const payload = {
      id: values.id,
      seo: {
        headerCode: values.headerCode,
        bodyStartCode: values.bodyStartCode,
        bodyEndCode: values.bodyEndCode,
      },
      homePage: {
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaImage: values.metaImage,
        metaKeywords: values.metaKeywords,
      },
    };

    try {
      const res = payload.id
        ? await updateSetting(payload)
        : await saveSetting(payload);

      if (!res?.success) {
        return errorNotification({ message: res?.message || "Operation failed" });
      }

      successNotification({ message: res.message });
    } catch (error: any) {
      errorNotification({
        message:
          error?.response?.data?.message || error?.message || "Unexpected error",
      });
    } finally {
      setLoading(false);
      dispatch(setSetting({}));
      dispatch(setAction({}));
    }
  };

  // Custom File Upload Handler
  const customUploadRequest = async ({ file, filename, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append(filename, file);

      const res = await uploadFile(formData);
      const uploadedFilename = res?.data?.[0]?.filename;

      if (!uploadedFilename) throw new Error("Invalid upload response");

      const newfile = await imageSetFile(uploadedFilename);

      const updatedData = {
        metaImagefileList: [newfile],
        metaImage: uploadedFilename,
      };

      form.setFieldsValue(updatedData);

      dispatch(setSetting({
        ...global.setting,
        homePage: updatedData,
      }));

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      onError({ err });
    }
  };

  // File Remove Handler
  const handleImageRemove = async (file: any) => {
    if (file.fileName) {
      const resetData = {
        metaImage: null,
        metaImagefileList: [],
      };

      form.setFieldsValue(resetData);

      dispatch(setSetting({
        ...global.setting,
        homePage: resetData,
      }));

      await fileDeleteWithPhoto({ filename: file.fileName });
    }
  };

  return (
    <div className="container mx-auto">
      <Form
        {...layout}
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError
      >
        {/* Hidden ID */}
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* SEO Codes */}
        <Form.Item name="headerCode" label="Header Code">
          <Input.TextArea placeholder="Enter header code" />
        </Form.Item>
        <Form.Item name="bodyStartCode" label="Body Start Code">
          <Input.TextArea placeholder="Enter body start code" />
        </Form.Item>
        <Form.Item name="bodyEndCode" label="Body End Code">
          <Input.TextArea placeholder="Enter body end code" />
        </Form.Item>

        <Divider orientation="left">Home Page Meta Data</Divider>

        {/* Meta Tags */}
        <Form.Item name="metaTitle" label="Meta Title">
          <Input.TextArea placeholder="Enter meta title" />
        </Form.Item>
        <Form.Item name="metaDescription" label="Meta Description">
          <Input.TextArea placeholder="Enter meta description" />
        </Form.Item>

        {/* Meta Image Upload */}
        <Form.Item
          name="metaImagefileList"
          label="Meta Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <ImgCrop rotationSlider showReset>
            <Upload
              name="metaImage"
              listType="picture-card"
              fileList={helpSupport?.metaImagefileList || []}
              onRemove={handleImageRemove}
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={customUploadRequest}
              maxCount={1}
              className="avatar-uploader"
            >
              {helpSupport?.metaImagefileList?.length >= 1 ? null : uploadButton}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item name="metaImage" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="metaKeywords" label="Meta Keywords">
          <Select
            mode="tags"
            placeholder="Enter keywords and press Enter"
            tokenSeparators={[","]}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            size="small"
            htmlType="submit"
            loading={loading}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Seo;
