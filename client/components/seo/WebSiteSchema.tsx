import appConfig from '@/appConfig';
import StructuredData from './StructuredData';

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  searchUrl?: string;
}

/**
 * WebSiteSchema Component
 * Generates WebSite structured data with search functionality
 * Enables sitelinks search box in Google search results
 */
export default function WebSiteSchema({
  name = appConfig.name,
  url = appConfig.baseUrl || 'https://ecommerce.com',
  description = 'Premium e-commerce platform for quality products',
  searchUrl = `${url}/products?search={search_term_string}`,
}: WebSiteSchemaProps) {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueRequired: true,
        valueName: 'search_term_string',
      },
    },
  };

  return <StructuredData data={websiteData} />;
}
