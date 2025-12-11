import React from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * StructuredData Component
 * Renders JSON-LD structured data for SEO
 * 
 * @param data - The schema.org structured data object
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}
