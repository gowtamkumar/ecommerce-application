"use client";
import { ActionType } from "@/constants/constants";
import {
  deleteMultipleFilesWithPhoto,
  fileDeleteWithPhoto,
} from "@/lib/apis/file";
import { setAction, setLoading } from "@/redux/features/global/globalSlice";
import { AppstoreOutlined, BarsOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm, Segmented } from "antd";
import { useEffect, useState } from "react";
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
    } catch (error: any) {
      console.log("error", error);
      alert(error.message);
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-global-primary-fontfamily">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your images and assets</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:block">
            <SearchEngine />
          </div>
          <MediaUpload setFiles={setFiles} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 flex flex-wrap gap-4 justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Segmented
            options={[
              { value: 'grid', icon: <AppstoreOutlined /> },
              { value: 'list', icon: <BarsOutlined /> },
            ]}
            value={viewMode}
            onChange={(val) => setViewMode(val as "grid" | "list")}
          />
          <div className="sm:hidden">
            <SearchEngine />
          </div>
        </div>

        {selected?.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg animate-fade-in">
            <span className="text-sm font-medium text-red-600">{selected.length} Selected</span>
            <div className="h-4 w-[1px] bg-red-200 mx-1"></div>
            <Button
              type="text"
              size="small"
              className="text-red-600 hover:text-red-700 hover:bg-red-100"
              onClick={() => setSelected([])}
            >
              Clear
            </Button>
            <Popconfirm
              title="Delete Images"
              description={`Are you sure you want to delete ${selected.length} items?`}
              onConfirm={() => deleteMultipleFilesHandle(selected)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span className="text-gray-500">No media files found</span>}
              >
                <MediaUpload setFiles={setFiles} />
              </Empty>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-center">
          <MediaPagination files={files} />
        </div>
      </div>

      <MediaDetails />
    </div>
  );
};

export default MediaLibrary;
