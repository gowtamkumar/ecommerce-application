import React, { useEffect, useState } from "react";
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
  getCategories,
  saveCategory,
  updateCategory,
} from "@/lib/apis/categories";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import appConfig from "@/appConfig";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

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

  useEffect(() => {
    fetchData();
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, []);

  const fetchData = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const newData = { ...payload };
      const categories = await getCategories();
      setCategories(categories.data);
      setFormData(newData); // Use product.data?.tags or default to empty array
      setFormValues(newData);
    } catch (err) {
      console.error("Error fetching Category data:", err);
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleSubmit = async (values: any) => {
    let newData = values as any;

    // return console.log("newData:", newData);

    const result = newData.id
      ? () => updateCategory(newData)
      : () => saveCategory(newData);

    const ress = await handleAsyncAction(result, "successfuly", dispatch);

     setTimeout(async () => {
      form.resetFields();
      fetchData();
    }, 1000);
    console.log("🚀 ~ ress called:", ress);

   

    // console.log("result", result);

    // if (result.success) {
    //   newData.id
    //     ? successNotification({ message: "Successfully Updated" })
    //     : successNotification({ message: "Successfully Added" });
    // }

    // if (result.issues) {
    //   errorNotification({ message: "Please Fill the form carefully" });
    //   dispatch(setLoading({ save: false }));
    // }

    // if (!result.success && !result.issues) {
    //   errorNotification({ message: "Please Fill the form carefully" });
    //   dispatch(setLoading({ save: false }));
    // }

    // setTimeout(async () => {
    //   dispatch(setLoading({ save: false }));
    //   form.resetFields();
    //   setFormValues({});
    // }, 1000);
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
        url: `${appConfig.apiUrl}/uploads/${filename || "no-data.png"}`,
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
    <Modal
      title={type === ActionType.UPDATE ? "Update Category" : "Create Category"}
      width={850}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <Form.Item
              name="name"
              label="name"
              rules={[
                {
                  required: true,
                  message: "name is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="parentId" label="parent">
              <TreeSelect
                showSearch
                style={{ width: "100%" }}
                // value={value}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
                // onChange={onChange}
                treeData={categories}
                // onPopupScroll={onPopupScroll}
              />

              {/* <Select.Option value={false}>Inactive</Select.Option> */}
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="description" label="Description">
              <Input placeholder="Enter " />
            </Form.Item>
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
          </div>

          <div className="col-span-1">
            <Form.Item
              hidden={!global.action.payload?.id}
              name="status"
              label="Status"
              className="mb-1"
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
                <Select.Option value={"Active"}>Active</Select.Option>
                <Select.Option value={"Inactive"}>Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="col-span-1 text-end">
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
            loading={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCategory;
