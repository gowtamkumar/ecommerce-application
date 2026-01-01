"use client";
import { saveColor, updateColor } from "@/lib/apis/color";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import {
  cyan,
  gold,
  green,
  grey,
  presetPalettes,
  purple,
  red,
} from "@ant-design/colors";
import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Form,
  Input,
  Modal,
} from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

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
  }, [form, payload, type]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateColor(values)
      : () => saveColor(values);

    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
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

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Color" : "Create Color"}
        </span>
      }
      width={500}
      zIndex={1050}
      open={color && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={resetFormData} style={{ borderRadius: "var(--button-border-radius)" }}>
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
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{ color: "#b7eb8f" }}
        className="mt-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-4">
          <Form.Item
            name="name"
            label="Color Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
            className="!mb-0"
          >
            <Input
              placeholder="Enter color name (e.g., Red, Blue, Green)"
              size="large"
              onChange={({ target }) => {
                form.setFieldsValue({ color: target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            name="color"
            label="Color Code"
            rules={[
              {
                required: true,
                message: "Color is required",
              },
            ]}
            className="!mb-0"
          >
            <ColorPicker
              presets={presets}
              showText
              size="large"
              onChange={(v) => form.setFieldsValue({ color: v.toHexString() })}
              className="!w-full"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddColor;
