import dynamic from "next/dynamic";

const AddPost = dynamic(() => import("@/components/dashboard/post/AddPost"));
export default async function page() {
  return (
    <div className="container mx-auto p-2">
      <AddPost />
    </div>
  );
}
