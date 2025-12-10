import MediaLibrary from "@/components/dashboard/Media-library/MediaLibrary";
import { getFiles } from "@/lib/apis/file";

export default async function page({ searchParams }: any) {
  const { page, limit, search } = searchParams;

  // Pass page & limit to your API call
  const files = await getFiles({ page, limit, search });

  return <MediaLibrary files={files || []} />;
}
