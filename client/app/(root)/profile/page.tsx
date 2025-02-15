import dynamic from "next/dynamic";

const Profile = dynamic(
  () => import("@/components/website/profile/Profile")
);

export default async function page() {
  return <Profile />;
}
