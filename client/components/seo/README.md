# SEO Components Usage Guide

## Overview

This directory contains reusable SEO components for implementing schema.org structured data (JSON-LD) to improve search engine visibility and rich results.

## Components

### 1. StructuredData
Base component for rendering any JSON-LD structured data.

```tsx
import { StructuredData } from '@/components/seo';

<StructuredData data={{
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Your Article Title"
}} />
```

### 2. OrganizationSchema
Organization/company information for brand recognition in search results.

```tsx
import { OrganizationSchema } from '@/components/seo';

<OrganizationSchema
  name="Your Company"
  url="https://example.com"
  logo="https://example.com/logo.png"
  description="Company description"
  email="info@example.com"
  phone="+1234567890"
  socialLinks={[
    'https://facebook.com/yourpage',
    'https://twitter.com/yourhandle',
  ]}
/>
```

### 3. WebSiteSchema
Website information with search functionality for sitelinks search box.

```tsx
import { WebSiteSchema } from '@/components/seo';

<WebSiteSchema
  name="Your Website"
  url="https://example.com"
  description="Website description"
  searchUrl="https://example.com/search?q={search_term_string}"
/>
```

### 4. BreadcrumbSchema
Breadcrumb navigation for better site structure understanding.

```tsx
import { BreadcrumbSchema } from '@/components/seo';

<BreadcrumbSchema items={[
  { name: 'Home', url: '/' },
  { name: 'Products', url: '/products' },
  { name: 'Laptops', url: '/products/laptops' },
  { name: 'MacBook Pro', url: '/products/laptops/macbook-pro' }
]} />
```

### 5. ProductSchema
Product information with pricing, availability, and reviews for rich product snippets.

```tsx
import { ProductSchema } from '@/components/seo';

<ProductSchema
  name="Product Name"
  description="Product description"
  image={['https://example.com/product.jpg']}
  sku="ABC123"
  brand="Brand Name"
  offers={{
    price: 299.99,
    currency: 'USD',
    availability: 'InStock',
    url: 'https://example.com/product'
  }}
  aggregateRating={{
    ratingValue: 4.5,
    reviewCount: 89
  }}
  reviews={[
    {
      author: 'John Doe',
      datePublished: '2024-01-15',
      reviewRating: {
        ratingValue: 5
      },
      reviewBody: 'Great product!'
    }
  ]}
/>
```

## Integration Examples

### Product Page
```tsx
// app/products/[slug]/page.tsx
import { ProductSchema, BreadcrumbSchema } from '@/components/seo';

export default function ProductPage({ product }) {
  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.images}
        sku={product.sku}
        brand={product.brand}
        offers={{
          price: product.price,
          currency: 'USD',
          availability: product.inStock ? 'InStock' : 'OutOfStock'
        }}
      />
      
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: product.category, url: `/products/${product.categorySlug}` },
        { name: product.name, url: `/products/${product.slug}` }
      ]} />
      
      {/* Your product page content */}
    </>
  );
}
```

## Testing & Validation

### Google Rich Results Test
1. Visit: https://search.google.com/test/rich-results
2. Enter your URL or paste HTML
3. Verify structured data is recognized

### Schema Markup Validator
1. Visit: https://validator.schema.org/
2. Paste your JSON-LD code
3. Check for errors

### Google Search Console
1. Go to Search Console
2. Navigate to Enhancements
3. Check for Rich Results reports

## SEO Benefits

| Schema Type | Benefit | Impact |
|-------------|---------|--------|
| Organization | Brand recognition, knowledge panel | High |
| WebSite | Sitelinks search box | High |
| Product | Rich snippets with price & rating | Critical |
| BreadcrumbList | Enhanced SERP navigation | Medium |

## Best Practices

1. **Always validate** structured data before deploying
2. **Keep data accurate** - Google may penalize incorrect information
3. **Use multiple schemas** on relevant pages for maximum visibility
4. **Update regularly** when product prices or availability change
5. **Test mobile** - Rich results appear prominently on mobile searches

## Common Issues

### Schema Not Showing
- Wait 2-4 weeks after implementation
- Check Google Search Console for errors
- Ensure data is accurate and complete

### Validation Errors
- Verify all required fields are present
- Check data types match schema.org specs
- Remove any extra/invalid properties

## Resources

- [Schema.org Documentation](https://schema.org/)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Rich Results Test](https://search.google.com/test/rich-results)
