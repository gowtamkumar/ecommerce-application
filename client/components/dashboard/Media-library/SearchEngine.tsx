import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchEngine() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const route = useRouter();

  const searchHandle = () => {
    const page = searchParams?.get("page");
    const limit = searchParams?.get("limit");

    let queryString = "";

    if (page && limit) {
      queryString += `page=${page}&limit=${limit}&`;
    }

    if (query) {
      queryString += `search=${query}&`;
    }

    route.push(`/dashboard/media?${queryString}`);
  };

  return (
    <Input
      size="small"
      allowClear
      onClear={() => {
        const page = searchParams?.get("page");
        const limit = searchParams?.get("limit");

        let queryString = "";

        if (page && limit) {
          queryString += `page=${page}&limit=${limit}&`;
        }
        route.push(`/dashboard/media?${queryString}`);
      }}
      value={query}
      onChange={(e: any) => setQuery(e.target.value)}
      placeholder="Search for item..."
      style={{ height: 34 }}
      suffix={
        <SearchOutlined
          style={{ color: "#aaa", cursor: "pointer", fontSize: 22 }}
          onClick={searchHandle}
        />
      }
    />
  );
}
