import { getPublicCategories } from "@/lib/apis/categories";
import { Radio, Tabs } from "antd";
import Image from "next/image";
import Link from "next/link";

const CategoryTab = async () => {
  const categories = await getPublicCategories();
  console.log("categories", categories);

  return (
    <section className="mb-8">
      <Tabs
        defaultActiveKey="1"
        tabPosition="top"
        style={{ height: 220 }}
        items={categories.data.map((item: any) => {
          return {
            label: item.name,
            key: item.id,
            children: `Content of tab ${item.id}`,
          };
        })}
      />
    </section>
  );
};

export default CategoryTab;
