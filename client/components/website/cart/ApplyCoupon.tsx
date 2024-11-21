import React from 'react'

export default function ApplyCoupon() {
  return (
    <div className="mt-4 md:flex items-center justify-between gap-4">
    <div className="flex md:flex-row flex-col gap-2">
      <input
        type="text"
        placeholder="Coupon code"
        className="border border-gray-300 p-3 rounded"
      />
      <button className="btn-primary-bioxin rounded md:ml-1 w-full">
        Apply Coupon
      </button>
    </div>
  </div>
  )
}
