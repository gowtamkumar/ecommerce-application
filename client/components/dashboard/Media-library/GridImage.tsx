import FileViewer from "./FileViewer";
import ImageHoverPart from "./ImageHoverPart";

export default function GridImage({
  images,
  handleSelect,
  selected,
  handleView,
  handleDelete,
}: any) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {images.map((img: any) => {
        return (
          <div
            key={img.id}
            onClick={() => handleSelect(img)}
            className={`group relative cursor-pointer rounded-md overflow-hidden border-2 bg-gray-100 ${selected?.includes(img) ? "border-blue-500" : "border-transparent"
              }`}
          >
            <FileViewer
              file={{
                pdf: {
                  width: "100%",
                  height: "22vh",
                },
                mp4: {
                  width: "100%",
                  height: "20vh",
                },
                imgStyle: {
                  width: 500,
                  height: 500,
                  className: "w-full h-50 object-cover rounded-md",
                },
                imageData: img,
              }}
            />

            {/* Hover overlay */}
            <ImageHoverPart
              handleView={handleView}
              img={img}
              handleDelete={handleDelete}
            />
          </div>
        );
      })}
    </div>
  );
}
