import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress, updateShippingAddress } from "@/lib/apis/address";
import { getDivisions } from "@/lib/apis/geo-location/division";
import { getDistricts } from "@/lib/apis/geo-location/district";
import { getUpazilas } from "@/lib/apis/geo-location/upazila";
import { getUnions } from "@/lib/apis/geo-location/union";

const AddShippingAddress = () => {
  const [divisions, setDivision] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      setFormData(newData);
      const disvision = await getDivisions();
      // const district = await getDistricts();
      // const upazila = await getUpazilas();
      // const union = await getUnions();
      // setDivision(disvision.data);
      // setDistricts(district.data);
      // setUpazilas(upazila.data);
      // setUnions(union.data);
    })();
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateShippingAddress(newData)
        : await saveShippingAddress(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));

        toast.success(
          `Address ${newData?.id ? "Updated" : "Created"} Successfully`
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

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE
          ? "Update Address"
          : "Create Address"
      }
      width={850}
      zIndex={1050}
      open={
        global.action.type === ActionType.CREATE ||
        global.action.type === ActionType.UPDATE
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
            >
              <Select
                placeholder="Select"
                // optionFilterProp="children"
                // filterOption={(input, option) =>
                //   (option?.children as any)
                //     .toLowerCase()
                //     .indexOf(input.toLowerCase()) >= 0
                // }
              >
                <Select.Option value={"Home"}>Home</Select.Option>
                <Select.Option value={"Office"}>Office</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="name"
              label="Name"
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
            <Form.Item
              name="phoneNo"
              label="Phone No"
              rules={[
                {
                  required: true,
                  message: "phone No is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  required: true,
                  message: "email No is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="country"
              label="Country"
              rules={[
                {
                  required: true,
                  message: "country is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="city"
              label="City"
              rules={[
                {
                  required: true,
                  message: "city is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="thana"
              label="Thana"
              rules={[
                {
                  required: true,
                  message: "thana is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="union"
              label="Union"
              rules={[
                {
                  required: true,
                  message: "union is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="zipCode" label="Zip Code">
              <Input placeholder="Enter " />
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "address is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>
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
      </Form>
    </Modal>
  );
};

export default AddShippingAddress;
