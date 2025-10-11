import appConfig from "@/appConfig";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from "react-player";
import PdfViewer from "./PdfViewer";

export default function FileViewer({ file }: any) {
  const { pdf, mp4, imageData, imgStyle } = file;
  return (
    <>
      {imageData?.mimetype === "application/pdf" ? (
        <PdfViewer
          pdf={pdf}
          file={`${appConfig.baseApiUrl}/uploads/${imageData?.filename}`}
        />
      ) : imageData?.mimetype === "video/mp4" ? (
        <ReactPlayer
          src={`${appConfig.baseApiUrl}/uploads/${imageData?.filename}`}
          controls
          width={mp4.width}
          height={mp4.height}
        />
      ) : imageData?.mimetype === "audio/mpeg" ? (
        <ReactAudioPlayer
          src={`${appConfig.baseApiUrl}/uploads/${imageData?.filename}`}
          controls
        />
      ) : (
        <Image
          src={`${appConfig.baseApiUrl}/uploads/${imageData?.filename}`}
          width={imgStyle.width}
          height={imgStyle.height}
          alt={imageData?.originalname}
          className={imgStyle.className}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </>
  );
}
