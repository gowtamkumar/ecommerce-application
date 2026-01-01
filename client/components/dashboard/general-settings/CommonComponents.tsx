"use client";

import React from "react";
import { Typography, Form, Upload, Modal, Image as AntImage, UploadProps, Input } from "antd";
import ImgCrop from "antd-img-crop";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { handlePreview, handlePreviewCancel } from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { fileDeleteWithPhoto } from "@/lib/apis/file";

const { Title, Text } = Typography;

export const SettingsHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-4">
    <Title level={4} className="!mb-1">
      {title}
    </Title>
    {description && <Text type="secondary">{description}</Text>}
  </div>
);

export const UploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export const FileUploadField = ({
  name,
  label,
  fileList,
  aspect = 1,
  extra,
  maxCount = 1,
  onFileUpdate,
}: {
  name: string;
  label: string;
  fileList: any[];
  aspect?: number;
  extra?: string;
  maxCount?: number;
  onFileUpdate: (fileList: any[], fileName: string | null) => void;
}) => {
  const dispatch = useDispatch();

  const handleRemove = async (file: any) => {
    onFileUpdate([], null);
    if (file.fileName) {
      await fileDeleteWithPhoto({ filename: file.fileName });
    }
  };

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      const uploadedFile = {
        uid: Date.now().toString(),
        name: newFileName,
        status: "done",
        url: getUploadImageUrl(newFileName),
        fileName: newFileName,
      };
      onFileUpdate([uploadedFile], newFileName);
    }
  };

  return (
    <>
      <Form.Item
        name={`${name}fileList`}
        label={<span className="text-base font-medium">{label}</span>}
        valuePropName="fileList"
        extra={extra}
        className="!mb-0"
      >
        <ImgCrop rotationSlider showReset aspect={aspect}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onRemove={handleRemove}
            onPreview={(file) => handlePreview(file, dispatch)}
            customRequest={customRequest}
            maxCount={maxCount}
          >
            {fileList?.length >= maxCount ? null : UploadButton}
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item name={name} hidden>
        <Input />
      </Form.Item>
    </>
  );
};

export const PreviewModal = () => {
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);
    return (
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
    );
};
