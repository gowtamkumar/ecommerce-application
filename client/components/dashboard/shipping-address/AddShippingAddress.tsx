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
  const { payload, type, shippingAddress } = global.action;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading({ loading: true }));

      try {
        form.setFieldsValue(payload);
        const division = await getDivisions();
        setDivision(division.data);
        if (type === ActionType.UPDATE) {
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
    }
  }, [dispatch, form, payload, type]);

  const handleSubmit = async (values: any) => {
    const newData = { ...values };

    const result = newData.id
      ? () => updateShippingAddress(newData)
      : () => saveShippingAddress(newData);
    await handleAsyncAction(result, dispatch);
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
          {type === ActionType.UPDATE ? "Update Shipping Address" : "Create Shipping Address"}
        </span>
      }
      width={700}
      zIndex={1050}
      open={shippingAddress && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4">
          <Button
            size="large"
            onClick={resetFormData}
            style={{ borderRadius: "var(--button-border-radius)" }}
          >
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
            {payload?.id ? "Update Address" : "Save Address"}
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

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Address Type"
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
              className="!mb-0"
            >
              <Select placeholder="Select type" size="large">
                <Select.Option value="Home">Home</Select.Option>
                <Select.Option value="Office">Office</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Contact Name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
              className="!mb-0"
            >
              <Input placeholder="Enter contact name" size="large" />
            </Form.Item>

            <Form.Item
              name="phoneNo"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Phone number is required",
                },
              ]}
              className="!mb-0"
            >
              <Input placeholder="Enter phone number" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
              className="!mb-0"
            >
              <Input placeholder="Enter email address" size="large" />
            </Form.Item>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="divisionId" label="Division" className="!mb-0">
              <Select
                showSearch
                allowClear
                placeholder="Select division"
                size="large"
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
                    form.setFieldsValue({ districtId: undefined, upazilaId: undefined, unionId: undefined });
                    setUpazilas([]);
                    setUnions([]);
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

            <Form.Item name="districtId" label="District" className="!mb-0">
              <Select
                showSearch
                allowClear
                placeholder="Select district"
                size="large"
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
                    form.setFieldsValue({ upazilaId: undefined, unionId: undefined });
                    setUnions([]);
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

            <Form.Item name="upazilaId" label="Upazila" className="!mb-0">
              <Select
                showSearch
                allowClear
                placeholder="Select upazila"
                size="large"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={async (value) => {
                  if (value) {
                    const union = await getUnions({ upazilaId: value });
                    setUnions(union.data);
                    form.setFieldsValue({ unionId: undefined });
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

            <Form.Item name="unionId" label="Union" className="!mb-0">
              <Select
                showSearch
                allowClear
                placeholder="Select union"
                size="large"
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
          </div>
        </div>

        {/* Detailed Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Detailed Address
          </h3>
          <Form.Item
            name="address"
            label="Street Address"
            rules={[
              {
                required: true,
                message: "Address is required",
              },
            ]}
            className="!mb-0"
          >
            <Input.TextArea
              placeholder="Enter full street address"
              rows={3}
              className="!rounded-lg"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddShippingAddress;
