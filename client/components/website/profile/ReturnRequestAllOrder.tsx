import { returnOrder } from "@/lib/apis/return";
import { getSettings } from "@/lib/apis/setting";
import { errorNotification } from "@/lib/utils/notification";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { handlePreview, handlePreviewCancel, normFile } from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { Button, Form, Input, Modal, Select, Upload, Image } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";
import uploadButton from "@/components/share-component/uploadButton";

const ReturnRequestAllOrder = () => {
  const [reasons, setReasons] = useState<string[]>([
    "Defective product",
    "Wrong item received",
    "Size/Fit issue",
    "Quality not as expected",
    "Changed my mind",
  ]);
  const [formValues, setFormValues] = useState<any>({ images: [], fileList: [] });
  const global = useSelector(selectGlobal);
  const { payload, returnAllOrder, type } = global.action;

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await getSettings();
      if (res.success && res.data?.returnSetting?.predefinedReasons) {
        setReasons(res.data.returnSetting.predefinedReasons);
      }
    };
    fetchSettings();

    if (payload) {
      form.setFieldsValue(payload);
      setFormValues({
        ...payload,
        images: payload.images || [],
        fileList: payload.fileList || [],
      });
    }

    return () => {
      form.resetFields();
      setFormValues({ images: [], fileList: [] });
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    // Backend expects array of strings (filenames)
    const submissionData = { 
        ...values, 
        images: values.images || [] 
      };

    const result = await returnOrder(submissionData);
    if (!result.success) {
      errorNotification({ message: result.message });
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(payload);
      setFormValues(payload);
    } else {
      form.resetFields();
      setFormValues({ images: [], fileList: [] });
    }
  };

  const customUploadRequest = async (options: any) => {
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      const currentImages = form.getFieldValue("images") || [];
      const currentFileList = form.getFieldValue("fileList") || [];

      const updatedImages = [...currentImages, newFileName];
      const updatedFileList = [...currentFileList, newFile];

      form.setFieldsValue({
        images: updatedImages,
        fileList: updatedFileList,
      });
      setFormValues({
        ...formValues,
        images: updatedImages,
        fileList: updatedFileList,
      });
    }
  };

  return (
    <Modal
      title={`Order Return`}
      width={600}
      zIndex={1050}
      open={type === ActionType.UPDATE && returnAllOrder}
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
        <Form.Item name="orderId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Return Reason"
          rules={[{ required: true, message: "Return Reason is required" }]}
        >
          <Select placeholder="Select Reason">
            {reasons.map((reason) => (
              <Select.Option key={reason} value={reason}>
                {reason}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="comments"
          label="Additional Comments (Optional)"
        >
          <Input.TextArea placeholder="Enter additional details..." rows={3} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item
          name="fileList"
          label="Proof Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload proof images for all items in the order"
        >
          <Upload
            name="images"
            listType="picture-card"
            fileList={formValues?.fileList || []}
            onRemove={async (v: any) => {
              const currentImages = form.getFieldValue("images") || [];
              const currentFileList = form.getFieldValue("fileList") || [];
              
              const updatedImages = currentImages.filter((img: string) => img !== v.fileName);
              const updatedFileList = currentFileList.filter((file: any) => file.fileName !== v.fileName);
              
              form.setFieldsValue({ images: updatedImages, fileList: updatedFileList });
              setFormValues({ ...formValues, images: updatedImages, fileList: updatedFileList });
              
              if (v.fileName) {
                await fileDeleteWithPhoto({ filename: v.fileName });
              }
            }}
            onPreview={(file) => handlePreview(file, dispatch)}
            customRequest={customUploadRequest}
            multiple
            maxCount={5}
          >
            {(formValues?.fileList?.length || 0) < 5 && uploadButton}
          </Upload>
        </Form.Item>

        {/* Hidden field to store the raw filenames for the backend */}
        <Form.Item name="images" hidden>
          <Input />
        </Form.Item>

        <div className="text-end mt-4">
          <Button
            className="mx-2 capitalize"
            onClick={resetFormData}
          >
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={!payload?.orderId}
          >
            Submit Return for Full Order
          </Button>
        </div>
      </Form>

      <Modal
        open={global.previewOpen}
        title={global.previewTitle}
        footer={null}
        onCancel={() => handlePreviewCancel(dispatch)}
      >
        <Image
          alt="preview"
          style={{ width: "100%" }}
          src={global.previewImage}
          preview={false}
        />
      </Modal>
    </Modal>
  );
};

export default ReturnRequestAllOrder;
