import dayjs from "dayjs";
import FileViewer from "./FileViewer";
import ImageHoverPart from "./ImageHoverPart";

export default function RowImage({
  images,
  handleSelect,
  selected,
  handleView,
  handleDelete,
}: any) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="px-3 py-2 text-left">ছবি</th>
          <th className="px-3 py-2 text-left">নাম</th>
          <th className="px-3 py-2 text-left">তারিখ</th>
        </tr>
      </thead>
      <tbody>
        {images.map((img: any) => (
          <tr
            key={img.id}
            onClick={() => handleSelect(img)}
            className={`group relative cursor-pointer hover:bg-gray-50 ${selected?.includes(img) ? "bg-blue-50" : ""
              }`}
          >
            <td className="px-3 py-2">
              <FileViewer
                file={{
                  pdf: {
                    width: "40%",
                    height: "10vh",
                  },
                  mp4: {
                    width: "40%",
                    height: "10vh",
                  },
                  imgStyle: {
                    width: 500,
                    height: 500,
                    className: "w-60 h-20 object-cover rounded-md",
                  },
                  imageData: img,
                }}
              />
            </td>

            <td className="px-3 py-2">{img.originalname}</td>
            <td className="relative px-3 py-2">
              {dayjs(img.createdAt).format("MMMM D, YYYY")}
              <ImageHoverPart
                handleView={handleView}
                img={img}
                handleDelete={handleDelete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
