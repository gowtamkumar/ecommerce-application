// "use client";
// import Button from "@/components/dashboard/Button";
// import { saveSize } from "@/lib/apis/size";
// import React from "react";
// import { useFormState, useFormStatus } from "react-dom";

// export default function Size() {

//   const submitFormAction = async (prevState: any, formData: FormData) => {
//     try {
//       const sizeData = {
//         name: formData.get("name"),
//       } as any;

//       const result = await saveSize(sizeData);

//       return {
//         ...prevState,
//         error: null,
//         success: true,
//         resetKey: Date.now().toString(), // Generate a new resetKey to trigger form reset
//       };
//     } catch (error) {
//       console.error("Error during form submission:", error);
//       return {
//         ...prevState,
//         error: "Submission failed. Please try again.",
//       };
//     }
//   };

//   const [response, submitForm] = useFormState(submitFormAction, undefined);

//   return (
//     <div>
//       <p>Add new Size</p>
     

//       <table>
//         <tr>
//           <th>#ID</th>
//           <th>Name</th>
//           <th>Status</th>
//           <th>Action</th>
//         </tr>
//         <tr>
//           <td>Alfreds Futterkiste</td>
//           <td>Maria Anders</td>
//           <td>Germany</td>
//           <td>
//             <button className="me-3">Edit</button>
//             <button>Delete</button>
//           </td>
//         </tr>
//       </table>
//     </div>
//   );
// }
