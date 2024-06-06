"use client";
import Button from "@/components/dashboard/Button";
import saveSize from "@/lib/apis/size";
import { sizeValidationSchema } from "@/validation";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function Size() {
  const loginAction = async (prevState: any, formData: FormData) => {
    console.log("validatedFields", formData.get("name"));

    const sizeData = {
      name: formData.get("name"),
    } as any;

    console.log("🚀 ~ sizeData:", sizeData);

    const result = await saveSize(sizeData);
  };

  const [state, fromAction] = useFormState(loginAction, null);

  return (
    <div>
      <p>Add new Size</p>
      <form action={fromAction}>
        <div className="flex">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name"
            required
            className="p-2 block rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <input
            id="status"
            name="status"
            type="checkbox"
            placeholder="Enter status"
            className="p-2 block rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <Button before="Signing...." after="New Size" size="w-auto" />
        </div>
      </form>
    </div>
  );
}
