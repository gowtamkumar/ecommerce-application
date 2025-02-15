// import appConfig from "@/config";
// import { useRouter } from "next/navigation";

// interface PaginationProps {
//   slug: string;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const GlobalSearchPagination: React.FC<PaginationProps> = ({
//   slug,
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   const routes = useRouter();

//   return (
//     <div className="flex justify-center items-center space-x-2 mt-4 flex-wrap">
//       {/* Previous Button */}
//       <button
//         // onClick={() => {
//         //   routes.replace(
//         //     `/category/${slug}?per_page=${appConfig.productItemsPerPage}&page=${
//         //       +currentPage - 1
//         //     }`,
//         //     { scroll: false }
//         //   );
//         //   onPageChange(currentPage - 1);
//         // }}
//         disabled={currentPage === 1}
//         className={`px-4 py-2 border rounded-lg ${
//           currentPage === 1
//             ? "bg-gray-300 cursor-not-allowed"
//             : "bg-white hover:bg-gray-100"
//         }`}
//       >
//         Previous
//       </button>

//       {/* Page Numbers */}
//       {pageNumbers.map((number) => (
//         <button
//           key={number}
//           // onClick={() => {
//           //   onPageChange(number);
//           //   routes.push(
//           //     `/category/${slug}?per_page=${appConfig.productItemsPerPage}&page=${number}`,
//           //     { scroll: false }
//           //   );
//           // }}
//           className={`px-4 py-2 border rounded-lg ${
//             number === currentPage
//               ? "bg-blue-500 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           {number}
//         </button>
//       ))}

//       {/* Next Button */}
//       <button
//         onClick={() => {
//           onPageChange(currentPage + 1);
//           routes.push(
//             `/category/${slug}?per_page=${appConfig.productItemsPerPage}&page=${
//               +currentPage + 1
//             }`,
//             { scroll: false }
//           );
//         }}
//         disabled={currentPage === totalPages}
//         className={`px-4 py-2 border rounded-lg ${
//           currentPage === totalPages
//             ? "bg-gray-300 cursor-not-allowed"
//             : "bg-white hover:bg-gray-100"
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default GlobalSearchPagination;
