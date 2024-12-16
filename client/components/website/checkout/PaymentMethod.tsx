"use client";
import {
  selectCheckout,
  setCheckoutFormData,
} from "@/redux/features/checkout/checkoutSlice";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Alert, Checkbox, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";

export default function PaymentMethod() {
  const global = useSelector(selectGlobal);
  const checkout = useSelector(selectCheckout);
  const dispatch = useDispatch();
  const { checkoutFormData } = checkout || {};
  const { response } = global || {};
  return (
    <div className="mx-auto bg-white ">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold">
          Payment Method (Please select a payment method)
        </h2>
      </div>
      <div className="mx-auto bg-white lg:p-6 py-2 rounded-lg">
        <Radio.Group
          name="paymentMethod"
          onChange={({ target }) =>
            dispatch(
              setCheckoutFormData({
                ...checkoutFormData,
                paymentMethod: target.value,
              })
            )
          }
          value={checkoutFormData.paymentMethod}
          size="large"
        >
          <div className="mb-4 font-semibold border p-5">
            <Radio value="Cash">ক্যাশ অন ডেলিভারি</Radio>
          </div>

          <div className="mb-4 font-semibold border p-5">
            <Radio value="SSLCOMMERZ">SSLCOMMERZ</Radio>
          </div>
        </Radio.Group>

        {/* <!-- Terms and Conditions --> */}
        <div className="mb-4">
          <label className="flex items-center justify-between gap-x-2">
            <span>
              <Checkbox type="checkbox" />
              <span className="ml-1">
                রফকারির শর্তাবলীতো সম্মতি প্রদান করছি।{" "}
                <a href="#" className="text-blue-500 underline">
                  শর্তাবলী
                </a>
              </span>
            </span>
            {response.type && (
              <Alert
                className="p-0 m-0"
                message={`${response.message}`}
                type={response.type}
              />
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
