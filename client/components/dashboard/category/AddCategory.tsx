import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  TreeSelect,
  Upload,
} from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getAntdCategories,
  saveCategory,
  updateCategory,
} from "@/lib/apis/categories";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import appConfig from "@/appConfig";
import {
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import uploadButton from "@/components/website/uploadButton";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;
  // hook
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { payload, type } = global.action;

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const newData = { ...payload };
      const categories = await getAntdCategories();
      setCategories(categories.data);
      form.setFieldsValue(newData);
      setFormValues(newData);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, payload, form]);

  useEffect(() => {
    fetchData();
  }, [fetchData, global.action?.type]); // 👈 safer and cleaner

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));

    try {
      const res = values.id
        ? await updateCategory(values)
        : await saveCategory(values);

      if (!res?.success) {
        errorNotification({ message: res?.message || "Operation failed" });
        return null;
      }

      dispatch(setAction({}));
      successNotification({ message: res.message });
      return res;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      errorNotification({ message: errorMessage });
      return null;
    } finally {
      dispatch(setLoading({ save: false }));
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Category" : "Create Category"}
      // width={650}
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
              message: "name is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="parentId" label="Parent">
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            treeData={categories}
          />
        </Form.Item>

        <Form.Item name="description" label="Note">
          <Input.TextArea placeholder="Enter " />
        </Form.Item>

        <Form.Item name="active" label="Status" className="mb-1">
          <Select placeholder="Select">
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
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
            preview={false}
            style={{
              width: "100%",
            }}
            src={global.previewImage}
          />
        </Modal>

        <Form.Item {...tailLayout}>
          <div className="flex gap-2">
            <Button size="small" onClick={() => resetFormData(payload)}>
              Reset
            </Button>

            <Button
              size="small"
              type="primary"
              htmlType="submit"
              disabled={global.loading.save}
              loading={global.loading.save}
            >
              {payload?.id ? "Update" : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategory;
