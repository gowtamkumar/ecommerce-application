/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tag,
  theme,
  Upload,
} from "antd";
import {
  green,
  presetPalettes,
  red,
  gold,
  cyan,
  purple,
  grey,
} from "@ant-design/colors";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "@/constants/constants";
import { savePost, updatePost } from "@/lib/apis/posts";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import { getAllCategories } from "@/lib/apis/categories";

type Presets = Required<ColorPickerProps>["presets"][number];

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;
  const [previewTitle, setPreviewTitle] = useState("");

  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      const resCategory = await getAllCategories();
      const postCategories = newData?.postCategories?.map(
        ({ categoryId }: { categoryId: number }) => categoryId
      );
      setTags(newData?.tags || []);
      setCategories(resCategory.data);
      setFormData({ ...newData, postCategories });
    })();
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let newData = { ...values, tags };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updatePost(newData)
        : await savePost(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));

        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      toast.error(err);
    }
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

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
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
        url: `http://localhost:3900/uploads/${filename || "no-data.png"}`,
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

  const normFile = (e: { fileList: string }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleCancel = () => setPreviewOpen(false);

  // file Preview
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE ? "Update Post" : "Create Post"
      }
      width={900}
      zIndex={1050}
      open={
        global.action.post &&
        (global.action.type === ActionType.CREATE ||
          global.action.type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        // onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
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
                className="mb-1"
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
                        setTags(
                          tags.filter((item: any, idex) => idex !== index)
                        )
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
                    onPreview={handlePreview}
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
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <Image
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </div>

            <div className="col-span-1">
              <Form.Item
                name="content"
                className="mb-1"
                label="Content"
                rules={[
                  {
                    required: true,
                    message: "content is required",
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter Title" />
              </Form.Item>
            </div>

            <div className={`col-span-1 `}>
              <Form.Item name="status" label="Status">
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Status"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as any)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Published">Published</Select.Option>
                  <Select.Option value="Prchived">Prchived</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1 text-end">
              <Button
                className="mx-2 capitalize"
                size="small"
                onClick={resetFormData}
              >
                Reset
              </Button>
              <Button
                size="small"
                // htmlType="submit"
                onClick={handleSubmit}
                className="capitalize"
                loading={global.loading.save}
              >
                {payload?.id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPost;
