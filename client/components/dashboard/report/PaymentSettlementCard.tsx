"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { FiCheck, FiCreditCard, FiDollarSign, FiRotateCcw } from "react-icons/fi";

interface PaymentSettlementCardProps {
  payments: any;
}

export default function PaymentSettlementCard({ payments }: PaymentSettlementCardProps) {
  const { formatPrice } = useCurrency();

  const sslDebit = Number(payments?.ssl_debit_amount) || 0;
  const cashDebit = Number(payments?.cash_debit_amount) || 0;
  const sslCredit = Number(payments?.ssl_credit_amount) || 0;
  const cashCredit = Number(payments?.cash_credit_amount) || 0;

  const totalCollections = sslDebit + cashDebit;
  const totalRefunds = sslCredit + cashCredit;
  const netSettled = totalCollections - totalRefunds;

  const digitalShare =
    totalCollections > 0 ? Math.round((sslDebit / totalCollections) * 100) : 0;
  const codShare = totalCollections > 0 ? 100 - digitalShare : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FiCreditCard className="text-global-primary" />
              <span>Payment & Gateway Audit</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Settlement channels, debit collections, and refund debits
            </p>
          </div>

          <div className="w-8 h-8 rounded-lg bg-global-primary/15 text-global-primary flex items-center justify-center text-sm font-bold">
            <FiDollarSign />
          </div>
        </div>

        {/* Net Settled Hero Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-global-primary to-global-hover text-white shadow-md shadow-global-primary/20 mb-5">
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider block">
            Net Settled Cash Flow
          </span>
          <div className="text-2xl font-black mt-1">
            {formatPrice(netSettled)}
          </div>
          <div className="text-[11px] text-white/80 mt-1 flex items-center justify-between">
            <span>Gross: {formatPrice(totalCollections)}</span>
            <span>Refunds: -{formatPrice(totalRefunds)}</span>
          </div>
        </div>

        {/* Channels Breakdown */}
        <div className="space-y-4">
          {/* SSLCommerz Online */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>SSLCommerz (Online Gateway)</span>
              </span>
              <span>{formatPrice(sslDebit)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span>Channel share</span>
              <span className="font-bold text-blue-600">{digitalShare}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${digitalShare}%` }}
              />
            </div>
            {sslCredit > 0 && (
              <div className="mt-2 text-[11px] text-rose-600 flex items-center gap-1">
                <FiRotateCcw className="text-[10px]" />
                <span>Online refunds reversed: {formatPrice(sslCredit)}</span>
              </div>
            )}
          </div>

          {/* Cash on Delivery (COD) */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-global-primary" />
                <span>Cash on Delivery (COD)</span>
              </span>
              <span>{formatPrice(cashDebit)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span>Channel share</span>
              <span className="font-bold text-global-primary">{codShare}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-global-primary h-full rounded-full"
                style={{ width: `${codShare}%` }}
              />
            </div>
            {cashCredit > 0 && (
              <div className="mt-2 text-[11px] text-rose-600 flex items-center gap-1">
                <FiRotateCcw className="text-[10px]" />
                <span>COD refunds paid: {formatPrice(cashCredit)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] text-gray-400">
        <FiCheck className="text-emerald-500" />
        <span>Reconciliation synchronized with payment ledger</span>
      </div>
    </div>
  );
}

