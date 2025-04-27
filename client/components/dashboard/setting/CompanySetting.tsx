"use client";
import React, { useState } from "react";
import { Button, Form, Image, Input, Modal, Upload } from "antd";
import {
  selectGlobal,
  setFormValues,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
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

const CompanySetting = ({ currencies }: any) => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  form.setFieldsValue(global.formValues);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateSetting(values)
      : () => saveSetting(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
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
        name: `logo ${Math.random() * 10000 + ""}`,
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
      dispatch(
        setFormValues({
          ...global.formValues,
          fileList: [newfile],
          image: newFileName,
        })
      );
      onSuccess("Ok");
    } catch (err) {
      onError({ err });
    }
  };

  const resetFormData = (value: any) => {
    if (value?.id) {
      form.setFieldsValue(value);
      dispatch(setFormValues(form.getFieldsValue()));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
    setLoading(false);
  };

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 3, span: 12 },
  };

  return (
    <div className="container mx-auto">
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[
            {
              required: true,
              message: "Company Name is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="email" label="E-mail">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="phone" label="Phone No">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input placeholder="Enter " />
        </Form.Item>

        {/* <Form.Item name="currencyId" label="Currency" className="mb-1">
          <Select
            showSearch
            allowClear
            placeholder="Select "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {(currencies || []).map(
              (item: { name: string; id: number; symbol: string }) => (
                <Select.Option key={item.id} value={item.id}>
                  {`${item.name} - ${item.symbol}`}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item> */}

        <Form.Item
          name="fileList"
          label="Logo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <ImgCrop rotationSlider showReset>
            <Upload
              name="image"
              listType="picture-card"
              fileList={global.formValues?.fileList || []}
              onRemove={async (v) => {
                if (v.fileName) {
                  form.setFieldsValue({ image: null, fileList: [] });
                  dispatch(setFormValues({ image: null, fileList: [] }));
                  const params = { filename: v.fileName };
                  await fileDeleteWithPhoto(params);
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={customUploadRequest}
              maxCount={1}
            >
              {global.formValues?.fileList?.length >= 1 ? null : uploadButton}
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
            preview={false}
            src={global.previewImage}
          />
        </Modal>

        <Form.Item {...tailLayout}>
          <Button
            className="me-2"
            size="small"
            onClick={() => resetFormData(global.formValues)}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
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

export default CompanySetting;
