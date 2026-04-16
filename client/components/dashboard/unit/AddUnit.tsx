import { saveUnit, updateUnit } from "@/lib/apis/unit";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const AddUnit = () => {
  const global = useSelector(selectGlobal);
  const { payload, unit, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...global.action.payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateUnit(values)
      : () => saveUnit(values);

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

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Unit" : "Create Unit"}
        </span>
      }
      width={500}
      zIndex={1050}
      open={unit && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      forceRender
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
        className="mt-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label="Unit Name"
          rules={[
            {
              required: true,
              message: "Name is required",
            },
          ]}
          className="!mb-0"
        >
          <Input placeholder="Enter unit name (e.g., kg, liter, piece)" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUnit;
