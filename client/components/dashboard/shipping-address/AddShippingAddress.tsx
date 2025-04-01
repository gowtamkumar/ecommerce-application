"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingAddress,
  updateShippingAddress,
} from "@/lib/apis/shipping-address";
import { getDivisions } from "@/lib/apis/geo-location/division";
import { getDistricts } from "@/lib/apis/geo-location/district";
import { getUpazilas } from "@/lib/apis/geo-location/upazila";
import { getUnions } from "@/lib/apis/geo-location/union";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";

const AddShippingAddress = () => {
  const [divisions, setDivision] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload, type } = global.action;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading({ loading: true }));

      try {
        setFormData(payload);

        const division = await getDivisions();
        setDivision(division.data);
        if (type === ActionType.UPDATE) {
          console.log("Fetching Districts, Upazilas, Unions...");
          const districts = await getDistricts({
            divisionId: payload.divisionId,
          });
          const upazilas = await getUpazilas({
            districtId: payload.districtId,
          });
          const unions = await getUnions({ upazilaId: payload.upazilaId });

          setDistricts(districts.data);
          setUpazilas(upazilas.data);
          setUnions(unions.data);
        }
      } catch (err: any) {
        errorNotification({ message: err.message });
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };

    if (type) {
      fetchData();
    } else {
      console.log("No type detected, skipping fetch.");
    }
  }, [type]); // Ensure payload is included if necessary

  const handleSubmit = async (values: any) => {
    let newData = { ...values };

    const result = newData.id
      ? () => updateShippingAddress(newData)
      : () => saveShippingAddress(newData);

    const messageData = newData.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
    form.resetFields();
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    setDivision([]);
    setDistricts([]);
    setUpazilas([]);
    setUnions([]);
    form.resetFields();
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    // dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(payload);
      // dispatch(setFormValues(payload));
    } else {
      form.resetFields();
      // dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Address" : "Create Address"}
      width={650}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        // onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
            <Select.Option value="Home">Home</Select.Option>
            <Select.Option value="Office">Office</Select.Option>
          </Select>
        </Form.Item>

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

        <Form.Item
          name="phoneNo"
          label="Phone No"
          rules={[
            {
              required: true,
              message: "Phone No is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              message: "E-mail No is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

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

        <Form.Item name="divisionId" label="Division" className="mb-1">
          <Select
            showSearch
            allowClear
            placeholder="Select "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={async (value) => {
              if (value) {
                const districts = await getDistricts({ divisionId: value });
                setDistricts(districts.data);
              }
            }}
          >
            {divisions.map((item: { name: string; id: number }) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="districtId" label="District" className="mb-1">
          <Select
            showSearch
            allowClear
            placeholder="Select "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={async (value) => {
              if (value) {
                const upazila = await getUpazilas({ districtId: value });

                setUpazilas(upazila.data);
              }
            }}
          >
            {districts.map((item: { name: string; id: number }) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="upazilaId" label="Upazila" className="mb-1">
          <Select
            showSearch
            allowClear
            placeholder="Select "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={async (value) => {
              if (value) {
                const union = await getUnions({ upazilaId: value });
                console.log("union", union);

                setUnions(union.data);
              }
            }}
          >
            {upazilas.map((item: { name: string; id: number }) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="unionId" label="Union" className="mb-1">
          <Select
            showSearch
            allowClear
            placeholder="Select "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {unions.map((item: { name: string; id: number }) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

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
          <Input.TextArea placeholder="Enter " />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button className="me-2" size="small" onClick={resetFormData}>
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
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

export default AddShippingAddress;
