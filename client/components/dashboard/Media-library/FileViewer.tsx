import { getImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from "react-player";
import PdfViewer from "./PdfViewer";

export default function FileViewer({ file }: any) {
  const { pdf, mp4, imageData, imgStyle } = file;
  let fileUrl = "/default-placeholder.png";
  if (imageData?.path) {
    fileUrl = imageData.path;
  } else if (imageData?.filename) {
    fileUrl = getImageUrl(imageData.filename);
  }

  let content;
  if (imageData?.mimetype === "application/pdf") {
    content = <PdfViewer pdf={pdf} file={fileUrl} />;
  } else if (imageData?.mimetype === "video/mp4") {
    content = (
      <ReactPlayer
        src={fileUrl}
        controls
        width={mp4?.width}
        height={mp4?.height}
      />
    );
  } else if (imageData?.mimetype === "audio/mpeg") {
    content = <ReactAudioPlayer src={fileUrl} controls />;
  } else {
    content = (
      <Image
        src={fileUrl}
        width={imgStyle?.width || 500}
        height={imgStyle?.height || 500}
        alt={imageData?.originalname || "Media image"}
        className={imgStyle?.className}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return <>{content}</>;
}
