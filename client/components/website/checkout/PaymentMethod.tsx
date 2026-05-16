"use client";
import { paymentMethods } from "@/constants/constants";
import {
  selectCheckout,
  setCheckoutFormData,
} from "@/redux/features/checkout/checkoutSlice";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Alert, Checkbox, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BankOutlined, WalletOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function PaymentMethod() {
  const global = useSelector(selectGlobal);
  const checkout = useSelector(selectCheckout);
  const dispatch = useDispatch();
  const { checkoutFormData } = checkout || {};
  const { response } = global || {};

  return (
    <div className="space-y-8">
      <Radio.Group
        className="w-full"
        onChange={({ target }) =>
          dispatch(
            setCheckoutFormData({
              ...checkoutFormData,
              paymentMethod: target.value,
            })
          )
        }
        value={checkoutFormData.paymentMethod}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
             const isSelected = checkoutFormData.paymentMethod === method.value;
             return (
              <label
                key={method.value}
                className={`
                  relative flex cursor-pointer rounded-3xl border-2 p-6 transition-all
                  ${isSelected
                    ? "border-gray-900 bg-white shadow-xl shadow-gray-200"
                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                  }
                `}
              >
                <Radio value={method.value} className="sr-only" />
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? "bg-gray-900 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                       {method.value === 'Cash' ? <WalletOutlined className="text-xl" /> : <BankOutlined className="text-xl" />}
                    </div>
                    <div>
                      <p className={`text-sm font-black uppercase tracking-tight ${isSelected ? "text-gray-900" : "text-gray-500"}`}>
                        {method.label}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-blue-600 bg-blue-600 shadow-sm" : "border-gray-200"}`}>
                    {isSelected && <CheckCircleOutlined className="text-[10px] text-white" />}
                  </div>
                </div>
              </label>
             );
          })}
        </div>
      </Radio.Group>

      {/* Terms and Conditions */}
      <div className="pt-8 border-t border-gray-100">
        <div className="p-6 rounded-[1.5rem] bg-gray-50/50 border border-gray-100">
          <label className="flex items-start gap-4 cursor-pointer group">
            <Checkbox 
              className="mt-1"
              onChange={({ target }) =>
                dispatch(
                  setCheckoutFormData({
                    ...checkoutFormData,
                    termsAndConditions: target.checked,
                  })
                )
              }
              checked={checkoutFormData.termsAndConditions}
            />

            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-widest leading-relaxed">
              I certify that I have read and agree to the{" "}
              <a href="/terms-conditions" className="text-blue-600 hover:underline decoration-blue-600 underline-offset-4">
                Terms of Service
              </a>
              {" "}and{" "}
              <a href="/return-policy" className="text-blue-600 hover:underline decoration-blue-600 underline-offset-4">
                Return Policy
              </a>
            </span>
          </label>
        </div>

        {response?.message && (
          <div className="mt-6">
            <Alert
              message={<span className="text-xs font-black uppercase tracking-widest">{response.message}</span>}
              type={response.type}
              showIcon
              className="rounded-2xl border-none shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
