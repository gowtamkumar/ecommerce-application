/* eslint-disable @next/next/no-img-element */
import appConfig from "@/config";
import React from "react";

export default function AuthorSection({ author }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-10 flex items-center">
      <img
        src={`${appConfig.apiUrl}/uploads/${author?.image || "no-data.png"}`}
        alt="User Image"
        className="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{author.name}</h3>
        <p className="text-gray-600">
          Author Bio - A short description of the author’s background and
          expertise in the subject matter.
        </p>
      </div>
    </div>
  );
}
