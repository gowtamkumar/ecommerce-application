import {
  getAntdCategories,
  saveCategory,
  updateCategory,
} from "@/lib/apis/categories";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import {
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import {
  FolderOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tag,
  TreeSelect,
  Upload,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;

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
  }, [fetchData, global.action]);

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
      form.resetFields();
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
    form.resetFields();
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

  const isEditMode = type === ActionType.UPDATE;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEditMode ? "bg-blue-50" : "bg-green-50"
              }`}
          >
            <FolderOutlined
              className={`text-xl ${isEditMode ? "text-blue-600" : "text-green-600"
                }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 m-0">
              {isEditMode ? "Edit Category" : "Create New Category"}
            </h3>
            <p className="text-sm text-gray-500 m-0">
              {isEditMode
                ? "Update category information"
                : "Add a new category to your store"}
            </p>
          </div>
        </div>
      }
      width={700}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      forceRender
      footer={null}
      className="modern-modal"
      styles={{
        header: { borderBottom: "none", paddingBottom: 0 },
        body: { paddingTop: 24 },
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        layout="vertical"
        autoComplete="off"
        scrollToFirstError={true}
        className="modern-form"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* Category Name */}
        <Form.Item
          name="name"
          label={
            <span className="font-semibold text-gray-700">Category Name</span>
          }
          rules={[
            {
              required: true,
              message: "Please enter category name",
            },
          ]}
        >
          <Input
            placeholder="e.g., Electronics, Fashion, Home & Garden"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Parent Category */}
        <Form.Item
          name="parentId"
          label={
            <span className="font-semibold text-gray-700">
              Parent Category (Optional)
            </span>
          }
          extra="Leave empty for top-level category"
        >
          <TreeSelect
            showSearch
            size="large"
            style={{ width: "100%" }}
            styles={{ popup: { root: { maxHeight: 400, overflow: "auto" } } }}
            placeholder="Select parent category"
            allowClear
            treeDefaultExpandAll
            treeData={categories}
            className="rounded-lg"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label={
            <span className="font-semibold text-gray-700">Description</span>
          }
        >
          <Input.TextArea
            placeholder="Brief description of this category..."
            rows={3}
            className="rounded-lg"
          />
        </Form.Item>

        {/* Status & Featured in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="active"
            label={<span className="font-semibold text-gray-700">Status</span>}
          >
            <Select
              placeholder="Select status"
              size="large"
              className="rounded-lg"
            >
              <Select.Option value={true}>
                <Tag color="success">Active</Tag>
              </Select.Option>
              <Select.Option value={false}>
                <Tag color="default">Inactive</Tag>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isFeatured"
            valuePropName="checked"
            label={
              <span className="font-semibold text-gray-700">Featured</span>
            }
          >
            <Checkbox className="mt-2">
              <span className="text-sm">Display in featured section</span>
            </Checkbox>
          </Form.Item>
        </div>

        <Divider />

        {/* Image Upload Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <UploadOutlined className="text-lg text-gray-600" />
            <span className="font-semibold text-gray-700">Category Image</span>
          </div>

          <Form.Item
            name="fileList"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mb-0"
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
                className="category-uploader"
                onPreview={(file) => handlePreview(file, dispatch)}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {formValues?.fileList?.length >= 1 ? null : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <UploadOutlined className="text-3xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Square format recommended
                    </span>
                  </div>
                )}
              </Upload>
          </Form.Item>
          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>
        </div>

        {/* Preview Modal */}
        <Modal
          open={global.previewOpen}
          title="Image Preview"
          footer={null}
          onCancel={() => handlePreviewCancel(dispatch)}
          centered
        >
          <Image
            alt="preview"
            preview={false}
            style={{ width: "100%" }}
            src={global.previewImage}
            className="rounded-lg"
          />
        </Modal>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6">
          <Button
            size="large"
            icon={<UndoOutlined />}
            onClick={() => resetFormData(payload)}
            className="rounded-lg"
          >
            Reset
          </Button>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="rounded-lg min-w-[120px]"
          >
            {payload?.id ? "Update" : "Create"} Category
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        .category-uploader .ant-upload-select {
          width: 200px !important;
          height: 200px !important;
          border-radius: 12px !important;
          border: 2px dashed #d9d9d9 !important;
          transition: all 0.3s ease !important;
        }

        .category-uploader .ant-upload-select:hover {
          border-color: #1890ff !important;
          background: #fafafa !important;
        }

        .category-uploader .ant-upload-list-item-container {
          width: 200px !important;
          height: 200px !important;
          border-radius: 12px !important;
        }

        .modern-modal .ant-modal-header {
          padding: 24px 24px 0 !important;
        }

        .modern-form .ant-form-item-label > label {
          height: auto !important;
        }
      `}</style>
    </Modal>
  );
};

export default AddCategory;
