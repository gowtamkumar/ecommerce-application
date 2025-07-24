"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";

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
import { ActionType } from "@/constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";

//TODO need to work update oparation

const AddShippingAddress = () => {
  const [divisions, setDivision] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload, type, userShippingAddress } = global.action;

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const newData = { ...payload };
      const disvision = await getDivisions();
      setDivision(disvision.data);
      form.setFieldsValue(newData);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, form, payload]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (values: any) => {
    let newData = { ...values };

    const result = newData.id
      ? () => updateShippingAddress(newData)
      : () => saveShippingAddress(newData);

    await handleAsyncAction(result, dispatch);
    form.resetFields();
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
      open={
        (type === ActionType.CREATE && userShippingAddress) ||
        (type === ActionType.UPDATE && userShippingAddress)
      }
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
