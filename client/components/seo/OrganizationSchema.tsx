import appConfig from '@/appConfig';
import StructuredData from './StructuredData';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  socialLinks?: string[];
}

/**
 * OrganizationSchema Component
 * Generates Organization structured data for brand recognition in search results
 */
export default function OrganizationSchema({
  name = appConfig.name,
  url = appConfig.baseUrl || 'https://ecommerce.com',
  logo = `${url}/logo.png`,
  description = 'Premium e-commerce platform for quality products',
  email = appConfig.author.email,
  phone,
  address,
  socialLinks = [],
}: OrganizationSchemaProps) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    description,
    email,
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address,
      },
    }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  };

  return <StructuredData data={organizationData} />;
}
