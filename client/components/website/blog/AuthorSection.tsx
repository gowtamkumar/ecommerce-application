/* eslint-disable @next/next/no-img-element */
import appConfig from "@/appConfig";
import Image from "next/image";

export default function AuthorSection({ author }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-10 flex items-center">
      <Image
        alt="User Image"
        src={`${appConfig.apiUrl}/uploads/${author?.image || "no-data.png"}`}
        loading="lazy"
        // fill
        width={0}
        height={0}
        className="w-12 h-12 rounded-full mr-4"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
