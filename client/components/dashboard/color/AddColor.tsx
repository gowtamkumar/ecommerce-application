/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Form,
  Input,
  Modal,
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
import { saveColor, updateColor } from "@/lib/apis/color";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

type Presets = Required<ColorPickerProps>["presets"][number];

const AddColor = () => {
  const global = useSelector(selectGlobal);
  const { payload, type, color } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    form.setFieldsValue(newData);

    return () => {
      form.resetFields();
    };
  }, []);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateColor(values)
      : () => saveColor(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    // dispatch(setLoading({}));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
    }
  };

  const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map<Presets>(([label, colors]) => ({
      label,
      colors,
    }));

  const presets = genPresets({
    primary: green,
    red,
    gold,
    grey,
    cyan,
    purple,
  });

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Color" : "Create Color"}
      width={500}
      zIndex={1050}
      open={color && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{ color: "#b7eb8f" }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="name" label="Name">
          <Input
            placeholder="Enter Name"
            onChange={({ target }) => {
              form.setFieldsValue({ color: target.value });
            }}
          />
        </Form.Item>

        <Form.Item
          name="color"
          label="Code"
          rules={[
            {
              required: true,
              message: "color is required",
            },
          ]}
        >
          <ColorPicker
            presets={presets}
            showText
            size="small"
            onChange={(v) => form.setFieldsValue({ color: v.toHexString() })}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button className="me-2" size="small" onClick={resetFormData}>
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
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColor;
