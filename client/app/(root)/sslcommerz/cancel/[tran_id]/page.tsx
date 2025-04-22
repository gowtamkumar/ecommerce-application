'use client'

import { useParams } from "next/navigation";

export default function PaymentCancel() {
  const params = useParams();

  return (
    <div className="p-5 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-red-600">Payment Cancel!</h2>
      <p className="text-lg mt-3">
        Transaction ID: <b>{params.tran_id}</b>
      </p>
    </div>
  );
}
