"use client";
import { saveLead } from "@/lib/apis/leads";
import React, { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState({});
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: any) {
    const lead = await saveLead(email);
    console.log("🚀 ~ lead:", lead);
    setSuccess("Newsletter Successfully");
    setTimeout(() => {
      setSuccess("");
    }, 2000);
    event.preventDefault();
  }

  return (
    <>
      {success}
      <div className="flex py-6">
        <input
          type="email"
          placeholder="E-mail address"
          className="rounded-l-full border border-black px-2 py-2 focus:outline-none self-center w-2/3"
          onChange={({ target }) => setEmail({ email: target.value })}
        />
        <button
          className="bg-blue-600 text-white rounded-r-full px-4 py-2 font-semibold hover:bg-gray-800 focus:outline-none"
          onClick={handleSubmit}
        >
          Subscribe
        </button>
      </div>
    </>
  );
}
