import { stripHtml } from "@/lib/utils/seo";
import StructuredData from "./StructuredData";

interface ArticleSchemaProps {
  title: string;
  description?: string;
  image?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export default function ArticleSchema({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  authorName = "Admin",
}: ArticleSchemaProps) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: stripHtml(description) || title,
    ...(image && { image }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  return <StructuredData data={articleData} />;
}
