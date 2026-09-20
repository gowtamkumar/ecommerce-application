"use client";
import { paymentMethods } from "@/constants/constants";
import {
    selectCheckout,
    setCheckoutFormData,
} from "@/redux/features/checkout/checkoutSlice";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
    CreditCardOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    LockOutlined,
    SafetyCertificateOutlined,
    WalletOutlined
} from "@ant-design/icons";
import { Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";

export default function PaymentMethod() {
  const global = useSelector(selectGlobal);
  const checkout = useSelector(selectCheckout);
  const dispatch = useDispatch();
  const { checkoutFormData } = checkout || {};
  const { response } = global || {};

  const handleMethodSelect = (val: string) => {
    dispatch(
      setCheckoutFormData({
        ...checkoutFormData,
        paymentMethod: val,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = checkoutFormData.paymentMethod === method.value;
          const isCash = method.value === "Cash";

          return (
            <div
              key={method.value}
              onClick={() => handleMethodSelect(method.value)}
              className={`
                relative flex flex-col justify-between cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300
                ${
                  isSelected
                    ? "border-global-primary bg-linear-to-b from-global-primary/5 via-white to-white shadow-lg shadow-global-primary/10 ring-2 ring-global-primary/15"
                    : "border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-xs"
                }
              `}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                        isSelected
                          ? "bg-global-primary text-white shadow-sm shadow-global-primary/30 scale-105"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {isCash ? <WalletOutlined /> : <CreditCardOutlined />}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-black uppercase tracking-tight transition-colors ${
                          isSelected ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {isCash ? "Cash on Delivery" : "Online Payment"}
                      </h3>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                        {isCash ? "Pay at your doorstep" : "Instant digital gateway"}
                      </p>
                    </div>
                  </div>

                  {/* Radio Dot */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                      isSelected
                        ? "border-global-primary bg-global-primary shadow-xs scale-105"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {/* Badges / Description */}
                {isCash ? (
                  <div className="space-y-2 mt-2">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Pay easily in cash when your order is delivered to your shipping address.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                        ✓ No advance payment
                      </span>
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        ✓ Instant confirmation
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Secure digital payment via SSLCOMMERZ gateway with Cards & Mobile Banking.
                    </p>
                    {/* Payment Channel Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-black tracking-wide text-[#E2136E] bg-[#E2136E]/10 border border-[#E2136E]/20 px-2 py-0.5 rounded-md">
                        bKash
                      </span>
                      <span className="text-[10px] font-black tracking-wide text-[#F7941D] bg-[#F7941D]/10 border border-[#F7941D]/20 px-2 py-0.5 rounded-md">
                        Nagad
                      </span>
                      <span className="text-[10px] font-black tracking-wide text-[#8C3494] bg-[#8C3494]/10 border border-[#8C3494]/20 px-2 py-0.5 rounded-md">
                        Rocket
                      </span>
                      <span className="text-[10px] font-black tracking-wide text-[#1A1F71] bg-[#1A1F71]/10 border border-[#1A1F71]/20 px-2 py-0.5 rounded-md">
                        Visa / Master
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selection Notice Callout */}
              {isSelected && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500 animate-in fade-in duration-300">
                  <InfoCircleOutlined className="text-global-primary text-xs shrink-0" />
                  <span>
                    {isCash
                      ? "Please keep exact cash ready upon delivery for a smooth handover."
                      : "You will be redirected to the secure SSLCOMMERZ payment screen."}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Optional Order Note */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-2xs">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          <FileTextOutlined className="text-global-primary" />
          <span>Delivery Instructions / Note (Optional)</span>
        </label>
        <textarea
          rows={2}
          value={checkoutFormData?.note || ""}
          onChange={(e) =>
            dispatch(
              setCheckoutFormData({
                ...checkoutFormData,
                note: e.target.value,
              })
            )
          }
          placeholder="e.g. Landmark nearby, preferred delivery time, call before arrival..."
          className="w-full text-xs text-gray-800 placeholder:text-gray-400 bg-gray-50/70 hover:bg-white focus:bg-white border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:border-global-primary focus:ring-4 focus:ring-global-primary/10 transition-all duration-200 resize-none"
        />
      </div>

      {/* Terms and Conditions Agreement */}
      <div className="rounded-2xl border border-gray-200/80 bg-gray-50/60 p-4 sm:p-5">
        <label className="flex items-start gap-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={Boolean(checkoutFormData?.termsAndConditions)}
            onChange={(e) =>
              dispatch(
                setCheckoutFormData({
                  ...checkoutFormData,
                  termsAndConditions: e.target.checked,
                })
              )
            }
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-global-primary focus:ring-global-primary cursor-pointer accent-global-primary"
          />

          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed">
            I certify that I have read and agree to the{" "}
            <a
              href="/terms-conditions"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-gray-900 underline underline-offset-4 decoration-global-primary hover:text-global-primary transition-colors"
            >
              Terms of Service
            </a>
            {" "}and{" "}
            <a
              href="/return-policy"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-gray-900 underline underline-offset-4 decoration-global-primary hover:text-global-primary transition-colors"
            >
              Return Policy
            </a>
            .
          </span>
        </label>

        {response?.message && (
          <div className="mt-4">
            <Alert
              message={<span className="text-xs font-bold">{response.message}</span>}
              type={response.type}
              showIcon
              className="rounded-xl border-none shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Security Reassurance Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 px-2">
        <div className="flex items-center gap-1.5 font-medium">
          <LockOutlined className="text-emerald-500" />
          <span>Your payment info is never stored on our servers</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <SafetyCertificateOutlined className="text-global-primary" />
          <span>SSL 256-Bit Encrypted Security</span>
        </div>
      </div>
    </div>
  );
}

