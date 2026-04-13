"use client";
import { Button, Col, Divider, Form, Input, Modal, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";

import { ActionType } from "@/constants/constants";
import { getDistricts } from "@/lib/apis/geo-location/district";
import { getDivisions } from "@/lib/apis/geo-location/division";
import { getUnions } from "@/lib/apis/geo-location/union";
import { getUpazilas } from "@/lib/apis/geo-location/upazila";
import {
  saveShippingAddress,
  updateShippingAddress,
} from "@/lib/apis/shipping-address";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";

const AddShippingAddress = () => {
  const [divisions, setDivision] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
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

      // Pre-fetch dependent data if editing
      if (newData.divisionId) {
        const dists = await getDistricts({ divisionId: newData.divisionId });
        setDistricts(dists.data);
      }
      if (newData.districtId) {
        const upas = await getUpazilas({ districtId: newData.districtId });
        setUpazilas(upas.data);
      }
      if (newData.upazilaId) {
        const uns = await getUnions({ upazilaId: newData.upazilaId });
        setUnions(uns.data);
      }

      form.setFieldsValue(newData);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, form, payload]);

  useEffect(() => {
    if (userShippingAddress) {
      fetchData();
    }
  }, [fetchData, userShippingAddress]);

  const handleSubmit = async (values: any) => {
    const newData = { ...values };

    const result = newData.id
      ? () => updateShippingAddress(newData)
      : () => saveShippingAddress(newData);

    await handleAsyncAction(result, dispatch);
    form.resetFields();
    handleClose();
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
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
      title={type === ActionType.UPDATE ? "Update Address" : "Add New Address"}
      width={720}
      open={userShippingAddress}
      onCancel={handleClose}
      footer={null}
      centered
      mask={false}
      forceRender
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        className="pt-4"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={24}>
          {/* Left Column: Personal Info */}
          <Col xs={24} md={12}>
            <Divider orientation={"left" as any} className="!mt-0 !mb-4 text-sm text-gray-400">Contact Details</Divider>
            <Form.Item
              name="type"
              label="Address Type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="Select Type">
                <Select.Option value="Home">Home</Select.Option>
                <Select.Option value="Office">Office</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Receiver Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="phoneNo"
              label="Phone Number"
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input placeholder="+880..." />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input placeholder="example@mail.com" />
            </Form.Item>
          </Col>

          {/* Right Column: Location Info */}
          <Col xs={24} md={12}>
            <Divider orientation={"left" as any} className="!mt-0 !mb-4 text-sm text-gray-400">Location Details</Divider>
            <Form.Item name="divisionId" label="Division" rules={[{ required: true, message: "Required" }]}>
              <Select
                showSearch
                placeholder="Select Division"
                optionFilterProp="children"
                onChange={async (value) => {
                  form.setFieldsValue({ districtId: null, upazilaId: null, unionId: null });
                  if (value) {
                    const districts = await getDistricts({ divisionId: value });
                    setDistricts(districts.data);
                  }
                }}
              >
                {divisions.map((item: { name: string; id: number }) => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="districtId" label="District" rules={[{ required: true, message: "Required" }]}>
              <Select
                showSearch
                placeholder="Select District"
                optionFilterProp="children"
                onChange={async (value) => {
                  form.setFieldsValue({ upazilaId: null, unionId: null });
                  if (value) {
                    const upazila = await getUpazilas({ districtId: value });
                    setUpazilas(upazila.data);
                  }
                }}
              >
                {districts.map((item: { name: string; id: number }) => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="upazilaId" label="Upazila" rules={[{ required: true, message: "Required" }]}>
              <Select
                showSearch
                placeholder="Select Upazila"
                optionFilterProp="children"
                onChange={async (value) => {
                  form.setFieldsValue({ unionId: null });
                  if (value) {
                    const union = await getUnions({ upazilaId: value });
                    setUnions(union.data);
                  }
                }}
              >
                {upazilas.map((item: { name: string; id: number }) => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="unionId" label="Union">
              <Select
                showSearch
                placeholder="Select Union (Optional)"
                optionFilterProp="children"
              >
                {unions.map((item: { name: string; id: number }) => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Detailed Address"
          className="mt-2"
          rules={[{ required: true, message: "Detailed address is required" }]}
        >
          <Input.TextArea placeholder="House No, Road No, Area, etc." rows={3} />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <Button onClick={resetFormData}>
            Reset Form
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={global.loading.save}
          >
            {payload?.id ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddShippingAddress;
