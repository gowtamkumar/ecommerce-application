import appConfig from "@/appConfig";
import { ActionType } from "@/constants/constants";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { Modal, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileViewer from "./FileViewer";
import { 
  FiCopy, 
  FiCheck, 
  FiX, 
  FiFileText, 
  FiImage, 
  FiFilm, 
  FiMusic, 
  FiCalendar, 
  FiHardDrive, 
  FiMaximize2 
} from "react-icons/fi";

export default function MediaDetails() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const global = useSelector(selectGlobal);
  const { payload, type, media } = global.action;
  const dispatch = useDispatch();

  useEffect(() => {
    if (media && type === ActionType.VIEW) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [media, type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(setAction({}));
    }, 300);
  };

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(
      `${appConfig.baseApiClientUrl}/uploads/${payload?.filename}`
    );
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Determine file icon based on mimetype
  const getFileIcon = (mimetype: string) => {
    if (mimetype?.startsWith('image/')) return <FiImage className="w-5 h-5 text-purple-500" />;
    if (mimetype?.startsWith('video/')) return <FiFilm className="w-5 h-5 text-blue-500" />;
    if (mimetype?.startsWith('audio/')) return <FiMusic className="w-5 h-5 text-pink-500" />;
    return <FiFileText className="w-5 h-5 text-orange-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      open={media && type === ActionType.VIEW}
      onCancel={handleClose}
      footer={null}
      width="95vw"
      centered
      closeIcon={null}
      style={{
        padding: 0,
        maxWidth: "1400px",
      }}
      bodyStyle={{
        height: "85vh",
        padding: 0,
        overflow: "hidden",
        borderRadius: "16px",
      }}
      wrapClassName="media-details-modal-backdrop"
      className="media-details-modal"
    >
      <div className="flex h-full bg-white overflow-hidden rounded-2xl shadow-2xl relative">
        {/* Close Button - Absolute positioned for easy access */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-all duration-300 shadow-sm border border-gray-100 group"
        >
          <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Left: Media Viewer (70%) */}
        <div className="w-full lg:w-[70%] h-full bg-gray-50/50 flex items-center justify-center relative overflow-hidden group">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
               }} 
          />
          
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div
              className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="relative w-full h-full shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 flex items-center justify-center">
                <FileViewer
                  file={{
                    pdf: {
                      width: "100%",
                      height: "100%",
                    },
                    mp4: {
                      width: "100%",
                      height: "100%",
                    },
                    imgStyle: {
                      width: 1200,
                      height: 800,
                      className: "w-full h-full object-contain max-h-[75vh]",
                    },
                    imageData: payload,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details Panel (30%) */}
        <div className="hidden lg:flex w-[30%] h-full bg-white border-l border-gray-100 flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] z-10">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-indigo-50 rounded-lg">
                {getFileIcon(payload?.mimetype)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">
                  File Details
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {payload?.mimetype?.toUpperCase() || 'UNKNOWN TYPE'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* File Info Card */}
            <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiFileText className="w-3 h-3" /> Filename
                </label>
                <p className="text-sm font-medium text-gray-900 break-all leading-relaxed">
                  {payload?.filename}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FiHardDrive className="w-3 h-3" /> Size
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {formatFileSize(payload?.size)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FiMaximize2 className="w-3 h-3" /> Dimensions
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {/* Assuming dimensions are available or placeholder */}
                    {payload?.width && payload?.height 
                      ? `${payload.width} × ${payload.height}` 
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiCalendar className="w-3 h-3" /> Uploaded
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(payload?.date || payload?.createdAt)}
                </p>
              </div>
            </div>

            {/* URL Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                Public URL
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">
                  Active
                </span>
              </label>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white border border-gray-200 rounded-xl p-1 flex items-center shadow-sm group-hover:border-indigo-300 transition-colors duration-300">
                  <div className="flex-1 px-3 py-2 overflow-hidden">
                    <p className="text-xs text-gray-500 truncate font-mono select-all">
                      {`${appConfig.baseApiClientUrl}/uploads/${payload?.filename}`}
                    </p>
                  </div>
                  <Tooltip title={copied ? "Copied!" : "Copy URL"}>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        copied 
                          ? "bg-green-500 text-white shadow-md transform scale-105" 
                          : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                    </button>
                  </Tooltip>
                </div>
              </div>
              <p className="text-xs text-gray-400 px-1">
                This URL is public and can be shared with anyone.
              </p>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-sm"
              style={{ borderRadius: "var(--button-border-radius)" }}
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
