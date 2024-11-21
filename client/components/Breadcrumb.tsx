import { Breadcrumb } from "antd";

type BreadcrumbItem = {
  title: string;
  href?: string;
};

export default function BreadCrumb() {
  const breadcrumb = [
    {
      title: "Home",
    },
    {
      title: "Application Center",
      href: "",
    },
    {
      title: "Application List",
      href: "",
    },
    {
      title: "An Application",
    },
  ]
  return (
    <div className="flex justify-center my-3 py-4">
      <Breadcrumb
        separator=">"
        style={{ fontFamily: "unset", fontSize: "unset", textAlign: 'center' }}
        className="font-semibold"
        items={breadcrumb}
      />
    </div>
  );
}
