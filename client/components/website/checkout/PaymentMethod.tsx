"use client";
import { paymentMethods } from "@/constants/constants";
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
    <div className="space-y-6">
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
          {paymentMethods.map((method) => (
            <label
              key={method.value}
              className={`
                relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all
                ${checkoutFormData.paymentMethod === method.value
                  ? "border-global-primary ring-1 ring-global-primary bg-global-primary/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <Radio value={method.value} className="sr-only" />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <p
                      className={`font-medium ${checkoutFormData.paymentMethod === method.value
                        ? "text-global-primary"
                        : "text-gray-900"
                        }`}
                    >
                      {method.label}
                    </p>
                    <p
                      className={`text-xs ${checkoutFormData.paymentMethod === method.value
                        ? "text-global-primary/80"
                        : "text-gray-500"
                        }`}
                    >
                      {method.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center
                    ${checkoutFormData.paymentMethod === method.value
                      ? "border-global-primary bg-global-primary"
                      : "border-gray-300"
                    }
                  `}
                >
                  {checkoutFormData.paymentMethod === method.value && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Radio.Group>

      {/* Terms and Conditions */}
      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox className="mt-1" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
            I agree to the{" "}
            <a href="/terms-conditions" className="text-global-primary hover:text-global-hover font-medium hover:underline">
              Terms and Conditions
            </a>
            {" "}and{" "}
            <a href="/return-policy" className="text-global-primary hover:text-global-hover font-medium hover:underline">
              Return Policy
            </a>
          </span>
        </label>

        {response?.message && (
          <div className="mt-4">
            <Alert
              message={response.message}
              type={response.type}
              showIcon
              className="rounded-lg border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
