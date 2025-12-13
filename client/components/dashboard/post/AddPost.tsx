"use client";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import { savePost, updatePost } from "@/lib/apis/posts";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { errorNotification } from "@/lib/utils/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tag,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// const TextQuillEditor = dynamic(
//   () => import("@/components/share-component/editor-quill/TextQuillEditor"),
//   { ssr: false }
// );

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

interface AddPostProps {
  categories?: any[];
}

const AddPost = ({ categories = [] }: AddPostProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [editorContent, setEditorContent] = useState("");
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;

  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading({ loading: true }));
      const newData = { ...payload };

      const postCategories = newData?.postCategories?.map(
        ({ categoryId }: { categoryId: number }) => categoryId
      );
      setTags(newData?.tags || []);
      setEditorContent(newData?.content || "");

      if (newData.image) {
        const file = {
          uid: Math.random() * 1000 + "",
          name: `image`,
          status: "done",
          fileName: newData.image,
          url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads/${newData.image}`,
        };
        newData.fileList = [file];
        setFormValues({ ...newData, postCategories, fileList: [file] });
      } else {
        setFormValues({ ...newData, postCategories });
      }

      form.setFieldsValue({ ...newData, postCategories });
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, form, payload]);

  useEffect(() => {
    fetchData();
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [fetchData, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    let newData = { ...values, content: editorContent, tags };

    const asyncFn = newData.id
      ? () => updatePost(newData)
      : () => savePost(newData);

    await handleAsyncAction(asyncFn, dispatch);

    // Redirect or clear after save? The original didn't seem to redirect explicitly but maybe it should.
    // The previous implementation used global action state, which suggests it might be a modal or tied to state.
    // Given the task is to redesign the page at /dashboard/post/new, redirection makes sense.
    if (!newData.id) {
      router.push('/dashboard/post');
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue]);
        setInputValue("");
      }
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

  const resetFormData = () => {
    form.resetFields();
    setFormValues({});
    setTags([]);
    setEditorContent("");
  };


  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-global-primary-fontfamily">
            {payload?.id ? "Edit Post" : "Create Post"}
          </h1>
          <p className="text-gray-500 mt-1">Manage your blog content and media.</p>
        </div>
        <div className="flex gap-3">
          <Button
            size="large"
            onClick={resetFormData}
            className="!rounded-lg !border-gray-300 !text-gray-600 hover:!text-gray-900 hover:!border-gray-400"
          >
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleSubmit}
            loading={global.loading.save}
            disabled={global.loading.save}
            className="!bg-black hover:!bg-gray-800 !border-none !rounded-lg !px-8 !font-medium"
          >
            {payload?.id ? "Update Post" : "Publish Post"}
          </Button>
        </div>
      </div>

      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onValuesChange={(_v, values) => setFormValues(values)}
        scrollToFirstError={true}
        initialValues={{ status: "Draft", fileList: [] }}
        className="space-y-8"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">
                Post Details
              </h2>

              <Form.Item
                name="title"
                label="Post Title"
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input placeholder="Enter post title" size="large" />
              </Form.Item>

              <label className="mb-2 block mt-4">Content</label>
              {/* <TextQuillEditor
                editorContent={editorContent}
                setEditorContent={setEditorContent}
              /> */}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Organization */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">
                Organization
              </h2>

              <Form.Item
                name="postCategories"
                label="Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Category"
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as any)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {(categories || []).map((item: any) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="mb-4">
                <label htmlFor="tags" className="mb-2 block">Tags</label>
                <Input
                  type="text"
                  id="tags"
                  value={inputValue}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(tags || []).map((item, index) => (
                    <Tag key={index} closable onClose={() => setTags(tags.filter((_, i) => i !== index))}>
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>

              <Form.Item name="status" label="Status">
                <Select placeholder="Select Status">
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Published">Published</Select.Option>
                  <Select.Option value="Prchived">Archived</Select.Option>
                </Select>
              </Form.Item>
            </div>

            {/* Media */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">
                Featured Image
              </h2>
              <Form.Item
                name="fileList"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <ImgCrop rotationSlider>
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
              onCancel={handlePreviewCancel}
            >
              <Image
                alt="example"
                width="100%"
                preview={false}
                src={global.previewImage}
              />
            </Modal>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddPost;
