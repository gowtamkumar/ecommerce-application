"use client";

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
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
    FiCheck,
    FiMail,
    FiMapPin,
    FiPhone,
    FiRotateCcw,
    FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

interface LocationOption {
  id: number;
  name: string;
}

interface AddShippingAddressProps {
  onSuccess?: (savedData?: any) => void;
}

export default function AddShippingAddress({ onSuccess }: AddShippingAddressProps = {}) {
  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);
  const [unions, setUnions] = useState<LocationOption[]>([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload, type, userShippingAddress, shippingAddress } = global.action || {};

  const isEditing = type === ActionType.UPDATE;
  const isOpen = Boolean((userShippingAddress || shippingAddress) && (type === ActionType.CREATE || type === ActionType.UPDATE));

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const divisionRes = await getDivisions();
      setDivisions(divisionRes.data || []);

      if (isEditing && payload) {
        const divisionId = payload.divisionId || payload.division?.id;
        const districtId = payload.districtId || payload.district?.id;
        const upazilaId = payload.upazilaId || payload.upazila?.id;
        const unionId = payload.unionId || payload.union?.id;

        // Pre-fetch dependent geolocation lists if editing
        if (divisionId) {
          const dists = await getDistricts({ divisionId });
          setDistricts(dists.data || []);
        }
        if (districtId) {
          const upas = await getUpazilas({ districtId });
          setUpazilas(upas.data || []);
        }
        if (upazilaId) {
          const uns = await getUnions({ upazilaId });
          setUnions(uns.data || []);
        }

        form.setFieldsValue({
          ...payload,
          id: payload.id,
          divisionId: divisionId || undefined,
          districtId: districtId || undefined,
          upazilaId: upazilaId || undefined,
          unionId: unionId || undefined,
          type: payload.type || "Home",
          status: Boolean(payload.status),
        });
      } else {
        form.resetFields();
        setDistricts([]);
        setUpazilas([]);
        setUnions([]);
        form.setFieldsValue({
          type: "Home",
          status: false,
        });
      }
    } catch (err: any) {
      errorNotification({ message: err.message || "Failed to load locations" });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, form, payload, isEditing]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [fetchData, isOpen]);

  const handleSubmit = async (values: any) => {
    const newData = { ...values };
    const addressId = newData.id || (isEditing ? payload?.id : undefined);

    if (addressId) {
      newData.id = addressId;
    }

    const result = (isEditing || addressId)
      ? () => updateShippingAddress(newData)
      : () => saveShippingAddress(newData);

    const res = await handleAsyncAction(result, dispatch);
    if (res) {
      form.resetFields();
      handleClose();
      if (onSuccess) {
        onSuccess(res);
      }
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    form.resetFields();
    setDistricts([]);
    setUpazilas([]);
    setUnions([]);
  };

  const resetFormData = () => {
    if (isEditing && payload?.id) {
      const divisionId = payload.divisionId || payload.division?.id;
      const districtId = payload.districtId || payload.district?.id;
      const upazilaId = payload.upazilaId || payload.upazila?.id;
      const unionId = payload.unionId || payload.union?.id;

      form.setFieldsValue({
        ...payload,
        id: payload.id,
        divisionId: divisionId || undefined,
        districtId: districtId || undefined,
        upazilaId: upazilaId || undefined,
        unionId: unionId || undefined,
        type: payload.type || "Home",
        status: Boolean(payload.status),
      });
    } else {
      form.resetFields();
      setDistricts([]);
      setUpazilas([]);
      setUnions([]);
      form.setFieldsValue({ type: "Home", status: false });
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-global-primary flex items-center justify-center shrink-0">
            <FiMapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 leading-tight">
              {isEditing ? "Update Delivery Address" : "Add Delivery Address"}
            </h3>
            <p className="text-[11px] font-normal text-gray-400">
              Provide recipient contact and delivery location details
            </p>
          </div>
        </div>
      }
      width={680}
      zIndex={1050}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      className="premium-modal"
      forceRender
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        className="pt-4"
        initialValues={{ type: "Home", status: false }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-6">
          {/* ── Section 1: Contact Details ── */}
          <div>
            <div className="mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-global-primary">
                Recipient & Contact Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="type"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Address Label / Type
                  </span>
                }
                rules={[{ required: true, message: "Please select an address type" }]}
              >
                <Select
                  placeholder="Select Type"
                  className="h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:leading-[42px]"
                >
                  <Select.Option value="Home">Home</Select.Option>
                  <Select.Option value="Office">Office</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="name"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Receiver Full Name
                  </span>
                }
                rules={[{ required: true, message: "Receiver name is required" }]}
              >
                <Input
                  prefix={<FiUser className="text-gray-300 mr-1" />}
                  placeholder="e.g. John Doe"
                  className="rounded-xl h-11"
                />
              </Form.Item>

              <Form.Item
                name="phoneNo"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Phone Number
                  </span>
                }
                rules={[{ required: true, message: "Phone number is required" }]}
              >
                <Input
                  prefix={<FiPhone className="text-gray-300 mr-1" />}
                  placeholder="e.g. +880 1712 345678"
                  className="rounded-xl h-11"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Email Address (Optional)
                  </span>
                }
                rules={[
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<FiMail className="text-gray-300 mr-1" />}
                  placeholder="recipient@example.com"
                  className="rounded-xl h-11"
                />
              </Form.Item>
            </div>
          </div>

          {/* ── Section 2: Location Details ── */}
          <div className="pt-2 border-t border-gray-100">
            <div className="mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-global-primary">
                Area & Geolocation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="divisionId"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Division
                  </span>
                }
                rules={[{ required: true, message: "Division is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Division"
                  optionFilterProp="children"
                  className="h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:leading-[42px]"
                  onChange={async (value) => {
                    form.setFieldsValue({
                      districtId: null,
                      upazilaId: null,
                      unionId: null,
                    });
                    setUpazilas([]);
                    setUnions([]);
                    if (value) {
                      const dists = await getDistricts({ divisionId: value });
                      setDistricts(dists.data || []);
                    }
                  }}
                >
                  {divisions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="districtId"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    District
                  </span>
                }
                rules={[{ required: true, message: "District is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select District"
                  optionFilterProp="children"
                  className="h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:leading-[42px]"
                  onChange={async (value) => {
                    form.setFieldsValue({ upazilaId: null, unionId: null });
                    setUnions([]);
                    if (value) {
                      const upas = await getUpazilas({ districtId: value });
                      setUpazilas(upas.data || []);
                    }
                  }}
                >
                  {districts.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="upazilaId"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Upazila / Thana
                  </span>
                }
                rules={[{ required: true, message: "Upazila is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Upazila"
                  optionFilterProp="children"
                  className="h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:leading-[42px]"
                  onChange={async (value) => {
                    form.setFieldsValue({ unionId: null });
                    if (value) {
                      const uns = await getUnions({ upazilaId: value });
                      setUnions(uns.data || []);
                    }
                  }}
                >
                  {upazilas.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="unionId"
                label={
                  <span className="text-xs font-semibold text-gray-700">
                    Union (Optional)
                  </span>
                }
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Union"
                  optionFilterProp="children"
                  className="h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:leading-[42px]"
                >
                  {unions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* ── Section 3: Street Address & Default Toggle ── */}
          <div className="pt-2 border-t border-gray-100 space-y-4">
            <Form.Item
              name="address"
              label={
                <span className="text-xs font-semibold text-gray-700">
                  Street Address / House / Flat
                </span>
              }
              rules={[{ required: true, message: "Detailed street address is required" }]}
              className="mb-2"
            >
              <Input.TextArea
                placeholder="House No, Flat No, Road Name, Area details..."
                rows={3}
                className="rounded-xl p-3 resize-none border-gray-200"
              />
            </Form.Item>

            {/* Default Address Switch */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Set as default shipping address
                </p>
                <p className="text-[11px] text-gray-400">
                  This address will be pre-selected during checkout
                </p>
              </div>
              <Form.Item name="status" valuePropName="checked" className="mb-0">
                <Switch className="bg-gray-300" />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-6">
          <Button
            type="text"
            icon={<FiRotateCcw className="w-3.5 h-3.5" />}
            onClick={resetFormData}
            className="text-xs text-gray-400 hover:text-gray-700 font-semibold"
          >
            Reset Form
          </Button>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleClose}
              className="h-10 px-5 rounded-xl font-semibold text-xs border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<FiCheck className="w-4 h-4" />}
              loading={global.loading.save}
              className="h-10 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
            >
              {isEditing ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
