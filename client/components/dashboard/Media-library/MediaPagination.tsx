import { Pagination } from "antd";
import { useRouter } from "next/navigation";

export default function MediaPagination({ files }: any) {
  const route = useRouter();

  const handleChange = (page: number, size: number) => {
    route.push(`/dashboard/media?page=${page}&limit=${size}`);
  };

  return (
    <Pagination
      current={files.page}
      pageSize={files.limit}
      total={files.total}
      showSizeChanger
      pageSizeOptions={["30", "60", "100", "200"]}
      onChange={handleChange}
      onShowSizeChange={handleChange} // needed for changing pageSize
      size="small"
    />
  );
}
