
// import { getUploadImageUrl } from "@/lib/utils/imageUrl";
// import dayjs from "dayjs";
// import Image from "next/image";

// export default function AuthorSection({ author }: any) {
//   if (!author) return null;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
//       <div className="relative w-20 h-20 flex-shrink-0">
//         <Image
//           alt={author?.name || "Author"}
//           src={getUploadImageUrl(author?.image)}
//           fill
//           className="rounded-full object-cover border-2 border-gray-100 shadow-sm"
//           sizes="(max-width: 768px) 100vw, 80px"
//         />
//       </div>
//       <div className="text-center sm:text-left">
//         <h3 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h3>
//         <p className="text-blue-600 font-medium text-sm mb-3 uppercase tracking-wide">
//           Content Creator
//         </p>
//         <p className="text-gray-600 leading-relaxed text-sm">
//           Joined {dayjs(author.createdAt).format("MMMM YYYY")}. Passionate about sharing insights and latest trends.
//         </p>
//       </div>
//     </div>
//   );
// }
