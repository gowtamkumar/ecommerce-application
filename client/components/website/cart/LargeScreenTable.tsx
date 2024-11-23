import Image from "next/image";
import { TiDeleteOutline } from "react-icons/ti";

export default function LeargeScreenTable() {
  return (
    <div className="md:flex md:visible hidden">
      <table className="w-full border-collapse border border-gray-200 ">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2 text-bioxin-p text-left">
              Product
            </th>
            <th className="border border-gray-200 p-2 text-bioxin-p">Price</th>
            <th className="border border-gray-200 p-2 text-bioxin-p">
              Quantity
            </th>
            <th className="border border-gray-200 p-2 text-bioxin-p">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Example Item 1 */}
          {[{}, {}, {}, {},  {}].map((item, idx) => (
            <tr
              key={idx}
              className={`${idx % 2 === 0 ? " bg-white" : "bg-bioxin-accent"}`}
            >
              <td className="border border-gray-200 p-2 flex items-center">
                <div className="flex items-center gap-2">
                  <TiDeleteOutline size={22} className="cursor-pointer text-gray-500" />
                  <Image
                    src="/logo.png"
                    alt="logo"
                    loading="lazy"
                    width={100}
                    height={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="me-2"
                  />
                  <p className="text-bioxin-p">Kiki Baby Wet Wipes</p>
                </div>
              </td>
              <td className="border border-gray-200 p-2 text-center">
                <p className="text-bioxin-p">৳850.00</p>
              </td>
              <td className="border border-gray-200 p-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                    -
                  </button>
                  <span>1</span>
                  <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                    +
                  </button>
                </div>
              </td>
              <td className="border border-gray-200 p-2 text-center">
                <p className="text-bioxin-p font-bold">৳850.00</p>
              </td>
            </tr>
          ))}


        </tbody>
      </table>
    </div>
  );
}
