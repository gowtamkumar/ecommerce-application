// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect } from "react";
// import { Button, Form, Input, Modal, Select } from "antd";
// import { ActionType } from "../../../constants/constants";
// import {
//   selectGlobal,
//   setAction,
//   setLoading,
// } from "@/redux/features/global/globalSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { errorNotification } from "@/lib/utils/notification";
// import { returnOrder } from "@/lib/apis/return";

// const ReturnRequestAllOrder = () => {
//   const global = useSelector(selectGlobal);
//   const { payload, returnAllOrder, type } = global.action;
//   // hook
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     form.setFieldsValue(payload);
//     return () => {
//       form.resetFields();
//     };
//   }, [global.action]);

//   const handleSubmit = async (values: any) => {

//     const result = await returnOrder(values);

//     console.log("result", result);
    

//     if (!result.success) {
//       errorNotification({ message: result.message });
//     }
//   };

//   const handleClose = () => {
//     dispatch(setAction({}));
//     dispatch(setLoading({}));
//   };

//   const resetFormData = () => {
//     if (payload?.id) {
//       form.setFieldsValue(payload);
//     } else {
//       form.resetFields();
//     }
//   };

//   return (
//     <Modal
//       title={`Order Return`}
//       width={500}
//       zIndex={1050}
//       open={type === ActionType.UPDATE && returnAllOrder}
//       onCancel={handleClose}
//       footer={null}
//     >
//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         autoComplete="off"
//         scrollToFirstError={true}
//       >
//         <Form.Item name="orderId" hidden>
//           <Input />
//         </Form.Item>

//         <Form.Item
//           name="reason"
//           label="Reason"
//           rules={[
//             {
//               required: true,
//               message: "Return Resson is required",
//             },
//           ]}
//         >
//           <Input.TextArea role="alert" placeholder="Enter Reason" />
//         </Form.Item>

//         <Form.Item
//           name="phone"
//           label="Phone"
//           rules={[
//             {
//               required: true,
//               message: "Phone is required",
//             },
//           ]}
//         >
//           <Input role="alert" placeholder="Enter Reason" />
//         </Form.Item>

//         <Form.Item
//           name="image"
//           label="Image"
//           rules={[
//             {
//               required: true,
//               message: "Phone is required",
//             },
//           ]}
//         >
//           <Input role="alert" placeholder="Enter Reason" />
//         </Form.Item>

//         <div className="text-end">
//           <Button
//             className="mx-2 capitalize"
//             size="small"
//             onClick={resetFormData}
//           >
//             Reset
//           </Button>
//           <Button
//             size="small"
//             color="primary"
//             htmlType="submit"
//             loading={global.loading.save}
//             disabled={!payload?.orderId}
//           >
//             Save
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default ReturnRequestAllOrder;
