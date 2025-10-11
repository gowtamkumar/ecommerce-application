"use client";
import { ActionType } from "@/constants/constants";
import {
  deleteMultipleFilesWithPhoto,
  fileDeleteWithPhoto,
} from "@/lib/apis/file";
import { setAction, setLoading } from "@/redux/features/global/globalSlice";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { FaTh, FaThList } from "react-icons/fa";
import { useDispatch } from "react-redux";
import GridImage from "./GridImage";
import MediaDetails from "./MediaDetails";
import MediaPagination from "./MediaPagination";
import MediaUpload from "./MediaUpload";
import RowShowImage from "./RowImage";
import SearchEngine from "./SearchEngine";

const MediaLibrary = ({ files }: any) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [file, setFiles] = useState(files.data);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const dispatch = useDispatch();

  const handleSelect = (img: any) => {
    setSelected((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  useEffect(() => {
    setFiles(files.data);
  }, [files.data]);

  const handleView = (img: any) => {
    dispatch(
      setAction({
        media: true,
        type: ActionType.VIEW,
        payload: img,
      })
    );
  };

  const handleDelete = async (img: any) => {
    try {
      dispatch(setLoading({ delete: true }));
      const params = { filename: img.filename };
      const res = await fileDeleteWithPhoto(params);

      if (!res.success) {
        return;
      }

      setFiles((prevFile: any[]) =>
        prevFile.filter((file: { id: number | string }) => file.id !== img.id)
      );
      // successNotification({ message: res.message });
    } catch (error: any) {
      console.log("error", error);
      alert(error.message);
      // errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
      dispatch(setAction({}));
    }
  };

  const deleteMultipleFilesHandle = async (selected: any) => {
    const filenames = selected?.map(
      (item: { filename: string }) => item.filename
    );

    try {
      dispatch(setLoading({ delete: true }));
      const res = await deleteMultipleFilesWithPhoto(filenames);
      if (!res.success) {
        alert(res.message);
        return;
      }
      setFiles((prevFile: any[]) =>
        prevFile.filter((file: any) => !filenames.includes(file.filename))
      );
    } catch (error: any) {
      console.log("error", error);
    } finally {
      dispatch(setLoading({ delete: false }));
      setSelected([]);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b px-4 py-1 bg-gray-200">
          <div className="flex items-center  gap-3">
            <div className="mt-5">
              <MediaUpload setFiles={setFiles} />
            </div>

            {/* 
          <select className="border px-2 py-1 rounded-md text-sm">
            <option>সমস্ত তারিখ</option>
            <option>অক্টোবর ২০২৫</option>
          </select> */}

            {selected?.length ? (
              <>
                <Popconfirm
                  title={
                    <span>
                      Are you sure{" "}
                      <span className="text-danger fw-bold">delete</span>{" "}
                      {selected?.length ? selected?.length : ""} item?
                    </span>
                  }
                  onConfirm={() => deleteMultipleFilesHandle(selected)}
                  placement="left"
                  okText="Yes"
                  okType="danger"
                  cancelText="No"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                >
                  <Button size="small" danger>
                    Bulk Delete {selected?.length}
                  </Button>
                </Popconfirm>

                <Button
                  size="small"
                  onClick={() => {
                    setSelected([]);
                  }}
                >
                  Clear
                </Button>
              </>
            ) : (
              ""
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md cursor-pointer ${viewMode === "grid" ? "bg-gray-200" : ""
                }`}
            >
              <FaTh />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md cursor-pointer ${viewMode === "list" ? "bg-gray-200" : ""
                }`}
            >
              <FaThList />
            </Button>
            <SearchEngine />

            {/*             
            <Input
              type="text"
              placeholder="অনুসন্ধান"
              className="border rounded-md px-3 py-1 text-sm"
            /> */}
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-auto p-4 bg-white">
          {viewMode === "grid" && files.data?.length ? (
            <GridImage
              images={file}
              handleSelect={handleSelect}
              handleView={handleView}
              handleDelete={handleDelete}
              selected={selected}
            />
          ) : files.data?.length ? (
            <RowShowImage
              images={file}
              handleSelect={handleSelect}
              handleView={handleView}
              handleDelete={handleDelete}
              selected={selected}
            />
          ) : (
            <Empty description="No media" />
          )}
        </div>

        <MediaDetails />

        {/* Footer */}
        <div className="flex justify-center items-center border-t pb-10 py-4 bg-gray-50">
          <MediaPagination files={files} />
        </div>
      </div>
    </>
  );
};

export default MediaLibrary;
