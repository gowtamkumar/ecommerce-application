"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tag,
  Upload,
} from "antd";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { savePost, updatePost } from "@/lib/apis/posts";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import { getCategories } from "@/lib/apis/categories";
import appConfig from "@/appConfig";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";

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

const AddPost = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [editorContent, setEditorContent] = useState("");
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;

  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [global.action]);

  const fetchData = async () => {
    try {
      dispatch(setLoading({ loading: true }));
      const newData = { ...payload };
      const resCategory = await getCategories();
      const postCategories = newData?.postCategories?.map(
        ({ categoryId }: { categoryId: number }) => categoryId
      );
      setTags(newData?.tags || []);
      setEditorContent(newData?.content || "");
      setCategories(resCategory.data);
      setFormData({ ...newData, postCategories });
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    let newData = { ...values, content: editorContent, tags };

    const asyncFn = newData.id
      ? () => updatePost(newData)
      : () => savePost(newData);

    const successMessage = newData.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(asyncFn, successMessage, dispatch);
  };

  // this function for tag
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue]);
        setInputValue(" ");
      }
    }
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    setFormValues(form.getFieldsValue());
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.action?.payload);
      setFormValues(global.action?.payload);
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
    }
    setTags([]);
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

  return (
    <Form
      layout="vertical"
      form={form}
      // onFinish={handleSubmit}
      autoComplete="off"
      onValuesChange={(_v, values) => setFormValues(values)}
      scrollToFirstError={true}
      initialValues={{ status: "Draft" }}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>

      <div className="my-5 flex items-start justify-between gap-4">
        <div className="grid flex-grow grid-cols-1 gap-5">
          <div className="col-span-1">
            <Form.Item
              name="title"
              label="Post Title"
              rules={[
                {
                  required: true,
                  message: "Title is required",
                },
              ]}
            >
              <Input placeholder="Enter Title" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Divider orientation="left">Product Category</Divider>

            <Form.Item
              name="postCategories"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Category is required",
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select"
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
          </div>

          <div className={`col-span-1 `}>
            <label htmlFor="tags">Tags</label>
            <Input
              type="text"
              id="tags"
              value={inputValue}
              onPressEnter={handleKeyPress}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type something and press Enter"
            />
            <div className="flex mt-2">
              {(tags || []).map((item, index) => (
                <Tag key={index}>
                  {item}{" "}
                  <span
                    onClick={() =>
                      setTags(tags.filter((item: any, idex) => idex !== index))
                    }
                    className="cursor-pointer"
                  >
                    X
                  </span>
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <Form.Item
              name="fileList"
              label="Image"
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

            <Modal
              open={global.previewOpen}
              title={global.previewTitle}
              footer={null}
              onCancel={handlePreviewCancel}
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
          </div>

          <div className="col-span-1">
            <label htmlFor="content">Content</label>

            {/* <TextQuillEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            /> */}
          </div>

          <div className={`col-span-1`}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select Status">
                <Select.Option value="Draft">Draft</Select.Option>
                <Select.Option value="Published">Published</Select.Option>
                <Select.Option value="Prchived">Prchived</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1 text-end">
            <Form.Item>
              <Button
                className="mx-2 capitalize"
                size="small"
                onClick={resetFormData}
              >
                Reset
              </Button>
              <Button
                size="small"
                type="primary"
                // htmlType="submit"
                onClick={handleSubmit}
                disabled={global.loading.save}
                loading={global.loading.save}
              >
                {payload?.id ? "Update" : "Save"}
              </Button>
            </Form.Item>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default AddPost;
