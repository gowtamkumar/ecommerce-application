"use client";

import CustomizerEditor from "@/components/dashboard/page/customizer/CustomizerEditor";
import { fetchAPI } from "@/lib/api";
import { PageData } from "@/types/customizer";
import { use, useEffect, useState } from "react";
import toast from "react-toastify";
import Loading from "../../loading";
import { getPageById } from "@/lib/apis/page";

export default function CustomizerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [data, setData] = useState<PageData>({
    title: "",
    slug: "",
    isHomePage: false,
    status: "published",
    content: { sections: [] },
  });

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [isNew]);

  const fetchPage = async () => {
    try {
      const res = await fetchAPI(`/pages/${resolvedParams.id}`);
      if (res.success) {
        const page = res.data;
        // The entity has 'sections' column, but Customizer expects data.content.sections
        const sections = page.sections || [];

        const adaptedSections = sections.map((s: any) => ({
          id: s.id,
          type: s.type === 'hero' ? 'hero-banner' : s.type, // Migration support
          settings: s.settings || s.content || {}, // Handle renamed content field
          styles: s.styles || { paddingTop: 40, paddingBottom: 40 },
          disabled: s.disabled || false,
        }));

        setData({
          id: page.id,
          title: page.title || "",
          slug: page.slug || "",
          isHomePage: page.isHomePage || false,
          status: page.status || "published",
          metaTitle: page.metaTitle || "",
          metaDescription: page.metaDescription || "",
          typography: page.typography || undefined,
          content: { sections: adaptedSections }
        });
      } 
      else {
        console.error("Page not found");
      }
    } catch (error) {
      console.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loading />
      </div>
    );
  }

  return <CustomizerEditor pageId={resolvedParams.id} initialData={data} />;
}
