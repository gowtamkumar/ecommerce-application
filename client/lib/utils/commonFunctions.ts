import { setAction, setLoading } from "@/redux/features/global/globalSlice";
import { errorNotification, successNotification } from "./notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export const handleAsyncAction = async (
  asyncFn: () => Promise<any>,
  successMessage: string,
  dispatch: any
) => {
  try {
    dispatch(setLoading({ save: true }));
    await asyncFn();
    successNotification({ message: successMessage });

    setTimeout(() => {
      dispatch(setLoading({ save: false }));
      dispatch(setAction({}));
    }, 100);
  } catch (error: any) {
    errorNotification({ message: error.message });
    dispatch(setLoading({ save: false }));
    dispatch(setAction({}));
  }
};


export async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    throw new Error("User not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.user.accessToken}`,
  };
}

  // const handleSubmit = async (values: any) => {
  //   try {
  //     let newData = { ...values };
  //     // return console.log("newData:", newData);
  //     dispatch(setLoading({ save: true }));
  //     const result = newData.id
  //       ? await updateLead(newData)
  //       : await saveLead(newData);

  //     newData.id
  //       ? successNotification({ message: "Successfully Updated" })
  //       : successNotification({ message: "Successfully Added" });

  //     setTimeout(async () => {
  //       dispatch(setLoading({ save: false }));
  //       dispatch(setAction({}));
  //       form.resetFields();
  //     }, 100);
  //   } catch (error: any) {
  //     errorNotification({ message: error.message });
  //     dispatch(setLoading({ save: false }));
  //     dispatch(setAction({}));
  //   }
  // };



// export const handleClose = (dispatch: any, form: any) => {
//   dispatch(setAction({}));
//   dispatch(setLoading({}));
//   form.resetFields();
// };