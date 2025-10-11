import MediaLibrary from "@/components/dashboard/Media-library/MediaLibrary";
import { getFiles } from "@/lib/apis/file";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function page({ searchParams }: Props) {
  const { page, limit, search } = await searchParams;

  // Pass page & limit to your API call
  const files = await getFiles({ page, limit, search });

  return <MediaLibrary files={files || []} />;
}
