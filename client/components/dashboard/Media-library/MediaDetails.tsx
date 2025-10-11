import appConfig from "@/appConfig";
import { ActionType } from "@/constants/constants";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { Modal } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileViewer from "./FileViewer";

export default function MediaDetails() {
  const [copy, setCopied] = useState(false);
  const global = useSelector(selectGlobal);
  const { payload, type, media } = global.action;
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setAction({}));
  };

  return (
    <Modal
      title="View"
      open={media && type === ActionType.VIEW}
      onCancel={handleClose}
      footer={null}
      width="95vw"
      style={{
        top: 10,
        padding: 0,
      }}
      bodyStyle={{
        height: "80vh",
        overflow: "auto",
        padding: 0,
      }}
      zIndex={1050}
    >
      <div className="flex h-full">
        {/* Left: Image Gallery */}
        <div className="flex-1 overflow-auto p-4 grid gap-4 border-r">
          <div
            key={payload?.id}
            className="relative border rounded-md  border-gray-200 w-full h-full"
          >
            <FileViewer
              file={{
                pdf: {
                  width: "100%",
                  height: "80vh",
                },
                mp4: {
                  width: "100%",
                  height: "75vh",
                },
                imgStyle: {
                  width: 500,
                  height: 500,
                  className: "w-full h-auto object-contain",
                },
                imageData: payload,
              }}
            />
          </div>
        </div>

        {/* Right: Attachment Details */}
        <div className=" bg-gray-100 overflow-auto">
          <div className="p-2 border-b bg-gray-100">
            <h3 className="text-lg font-semibold">Attachment details</h3>
          </div>

          <div className="p-4">
            {/* Preview */}
            <div className="text-sm text-gray-600 mt-3 space-y-1">
              <p>{payload?.date}</p>

              <p>
                <strong>File name:</strong> {payload?.filename}
              </p>
              <p>
                <strong>File type:</strong> {payload?.mimetype}
              </p>
              <p>
                <strong>File size:</strong> {payload?.size}
              </p>
              <p>
                <strong>Dimensions:</strong> 1530 × 2162 pixels
              </p>
            </div>

            {/* Fields */}
            <div className="mt-5 space-y-3">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  বিকল্প লেখা (Alt Text)
                </label>
                <input
                  type="text"
                  className="border w-full rounded-md px-3 py-2 text-sm mt-1"
                  placeholder="ছবির বর্ণনা লিখুন..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  শিরোনাম (Title)
                </label>
                <input
                  type="text"
                  defaultValue={payload?.name}
                  className="border w-full rounded-md px-3 py-2 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ক্যাপশন (Caption)
                </label>
                <textarea className="border w-full rounded-md px-3 py-2 text-sm mt-1"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  বিবরণ (Description)
                </label>
                <textarea className="border w-full rounded-md px-3 py-2 text-sm mt-1"></textarea>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ফাইল URL
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={`${appConfig.baseApiUrl}/uploads/${payload?.filename}`}
                    readOnly
                    className="border w-full rounded-md px-3 py-2 text-sm bg-gray-100"
                  />
                  <button
                    onClick={() => {
                      setCopied(true);
                      navigator.clipboard.writeText(
                        `${appConfig.baseApiUrl}/uploads/${payload?.filename}`
                      );
                      setTimeout(() => {
                        setCopied(false);
                      }, 1000);
                    }}
                    className="bg-gray-200 px-3 py-2 rounded-md text-sm hover:bg-gray-300"
                  >
                    {copy ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
