/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Form,
  Input,
  Modal,
  Select,
  theme,
} from "antd";
import { ActionType } from "../../../constants/constants";
import {
  generate,
  yellow,
  green,
  presetPalettes,
  red,
  orange,
  gold,
  gray,
  cyan,
  blue,
  purple,
  magenta,
  lime,
  geekblue,
  volcano,
  grey,
} from "@ant-design/colors";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { saveColor, updateColor } from "@/lib/apis/color";

import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";

type Presets = Required<ColorPickerProps>["presets"][number];

const AddColor = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    setFormData(newData);
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateColor(newData)
        : await saveColor(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        
        toast.success(
          `Color ${newData?.id ? "Updated" : "Created"} Successfully`
        );
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.action?.payload);
      dispatch(setFormValues(global.action?.payload));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
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
        global.action.type === ActionType.UPDATE
          ? "Update Color"
          : "Create Color"
      }
      width={500}
      zIndex={1050}
      open={
        global.action.color && 
       ( global.action.type === ActionType.CREATE ||
        global.action.type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        // onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{ color: "#b7eb8f" }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className="col-span-1">
              <Form.Item
                name="name"
                className="mb-1"
                label="Color Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Color Name"
                  onChange={({ target }) => {
                    form.setFieldsValue({ color: target.value });
                  }}
                />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item
                name="color"
                className="mb-1"
                label="Color Code"
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
                  onChange={(v) =>
                    form.setFieldsValue({ color: v.toHexString() })
                  }
                />
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
                color="blue"
                htmlType="submit"
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

export default AddColor;
