import appConfig from "@/appConfig";
import { getImageUrl, getProductImageUrls } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Table, TableColumnsType } from "antd";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function CouponProduct({ products }: any) {
  const global = useSelector(selectGlobal);

  const columns: TableColumnsType<any> = [
    {
      title: "Product Name",
      key: "name",
      sorter: (a, b) => a.product.name.length - b.product.name.length,
      render: (value) => {
        return (
          <div className="flex items-center gap-2">
            <Image
              width={50}
              height={50}
              alt={value.product.name}
              src={getImageUrl(value.product.thumbnailImage)}
              className="w-10 h-10 rounded-lg"
            />
            <span>{value.product.name}</span>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      dataSource={products}
      columns={columns}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
}
