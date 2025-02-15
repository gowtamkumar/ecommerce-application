import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Select, Upload } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { saveBanner, updateBanner } from "@/lib/apis/banner";
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

const AddBanner = () => {
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
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [payload]);

  const handleSubmit = async (values: any) => {
    let newData = { ...values };

    const result = newData.id
      ? () => updateBanner(newData)
      : () => saveBanner(newData);

    const messageData = newData.id
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Banner" : "Create Banner"}
      // width={550}
      zIndex={1050}
      open={
        global.action.banner &&
        (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
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
          name="type"
          label="Type"
          rules={[
            {
              required: true,
              message: "Type is required",
            },
          ]}
        >
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
            {["Slider", "Middle", "Left", "Right", "Footer"].map(
              (item: string) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "title is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="url" label="URL">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="fileList"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Image is required",
            },
          ]}
        >
          <ImgCrop
            // quality={1}
            // fillColor="white"
            // zoomSlider
            rotationSlider
            aspectSlider
            showReset
            // modalWidth={1000}
            // aspect={18 / 6}
            // minZoom={1}
            // maxZoom={3}
            // cropShape='rect'
          >
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

        <Form.Item name="status" label="Status" className="mb-1">
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
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            className="mx-2 capitalize"
            size="small"
            onClick={() => resetFormData(payload)}
          >
            Reset
          </Button>
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            className="capitalize"
            disabled={global.loading.save}
            loading={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBanner;
