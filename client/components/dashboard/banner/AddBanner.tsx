"use client";
import uploadButton from "@/components/share-component/uploadButton";
import { saveBanner, updateBanner } from "@/lib/apis/banner";
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
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const AddBanner = () => {
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;
  const global = useSelector(selectGlobal);
  const { payload, type, banner } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...global.action.payload };
    form.setFieldsValue(newData);
    setFormValues(newData);
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const newData = { ...values };

    const result = newData.id
      ? () => updateBanner(newData)
      : () => saveBanner(newData);

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
          {type === ActionType.UPDATE ? "Update Banner" : "Create Banner"}
        </span>
      }
      width={700}
      zIndex={1050}
      open={
        banner && (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
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
          {/* Type */}
          <Form.Item
            name="type"
            label="Banner Type"
            rules={[
              {
                required: true,
                message: "Type is required",
              },
            ]}
            className="!mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Select banner type"
              size="large"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as any)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {["Slider", "Banner", "Slider Right", "Footer"].map(
                (item: string) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                )
              )}
            </Select>
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
        </div>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <Form.Item
            name="title"
            label="Banner Title"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter banner title" size="large" />
          </Form.Item>

          {/* URL */}
          <Form.Item
            name="url"
            label="Banner URL"
            rules={[
              {
                required: true,
                message: "Url is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter link URL (optional)" size="large" />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label="Description" className="!mb-0">
            <Input.TextArea
              placeholder="Enter banner description (optional)"
              rows={3}
              size="large"
            />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item
            name="fileList"
            label="Banner Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: "Image is required",
              },
            ]}
            className="!mb-0"
          >
            <ImgCrop rotationSlider aspectSlider showReset aspect={18 / 6}>
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

export default AddBanner;
