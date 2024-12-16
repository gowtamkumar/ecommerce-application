import type { TableColumnsType } from "antd";
import { Rate, Table } from "antd";
import { reviewDisLike, reviewLike } from "@/lib/apis/review";
import { BiDislike, BiLike } from "react-icons/bi";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { selectProduct } from "@/redux/features/products/productSlice";
dayjs.extend(relativeTime);

interface DataType {
  key: string;
  product: any;
  rating: number;
  comment: string;
  status: string;
}

const ReviewTable = () => {
  const products = useSelector(selectProduct);
  const { reviews }: { reviews: DataType[] } = products.product;

  async function reviewIncrement(value: any) {
    try {
      await reviewLike({ id: value.id });
    } catch (error) {
      console.log(error);
    }
  }

  async function reviewDecrement(value: any) {
    try {
      await reviewDisLike({ id: value.id });
    } catch (error) {
      console.log(error);
    }
  }

  const columns: TableColumnsType<DataType> = [
    {
      render: (value) => {
        return (
          <div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Rate allowHalf value={+value.rating} disabled />
                <p>{value.user.name && value.user.name}</p>
              </div>
              <div>{value.createdAt && dayjs(value.createdAt).fromNow()}</div>
            </div>

            {/* review image section */}
            <div className="flex gap-3">
              {["", ""].map((item, idx) => (
                <Image
                  key={idx}
                  // placeholder="blur"
                  className="bg-slate-500"
                  loading="lazy"
                  src="/pos_software.png"
                  width={50}
                  height={50}
                  alt="Picture of the author"
                />
              ))}
            </div>

            <div className="flex justify-between ">
              <div>{value.comment}</div>
              <div className="flex gap-4">
                <div>
                  <BiLike
                    className="size-4 font-bold cursor-pointer"
                    onClick={() => reviewIncrement(value)}
                  />{" "}
                  <span>{value.like}</span>
                </div>
                <div>
                  <BiDislike
                    className="size-4 font-bold cursor-pointer"
                    onClick={() => reviewDecrement(value)}
                  />{" "}
                  <span>{value.disLike}</span>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      scroll={{ x: "auto" }}
      columns={columns}
      dataSource={reviews}
      pagination={{ pageSize: 5 }}
      rowHoverable={false}
      size="small"
    />
  );
};

export default ReviewTable;
