import appConfig from "@/appConfig";
import PageRenderer from "@/components/dashboard/page/PageRenderer";
import { getPageBySlug } from "@/lib/apis/page";
import { CustomizerSection } from "@/types/customizer";
import Link from "next/link";
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageRes = await getPageBySlug(slug);
  const page = pageRes?.data;

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.title,
    metadataBase: new URL(appConfig.baseUrl as any),
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.title,
      type: 'website',
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageRes = await getPageBySlug(slug);
  const page = pageRes?.data;

  if (!page || page.status !== 'published') {
    notFound();
  }

  // Check if page uses new sections system
  const hasSections = page.sections && Array.isArray(page.sections) && page.sections.length > 0;

  // If page has sections, render them dynamically (Shopify-like)
  if (hasSections) {
    const sections: CustomizerSection[] = page.sections.map((s: any) => ({
      id: s.id,
      type: s.type,
      settings: s.settings || {},
      styles: s.styles || { paddingTop: 40, paddingBottom: 40 },
      disabled: s.disabled || false,
    }));

    return (
      <div className="min-h-screen bg-gray-50">
        <PageRenderer 
          sections={sections} 
          typography={page.typography}
          className="w-full"
        />
      </div>
    );
  }

  // Fallback to old content-based rendering for backward compatibility
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section with Parallax-like effect */}
        <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50/90"></div>
          </div>

          {/* Animated Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="font-medium text-white">{page.title}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              {page.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-white/70 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
              <span className="flex items-center gap-2">
                Last updated: {formattedDate}
              </span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative z-20 -mt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-800 p-8 md:p-12 lg:p-16 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">
              <div className="prose prose-lg md:prose-xl max-w-none 
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-indigo-600 prose-a:no-underline prose-a:border-b-2 prose-a:border-indigo-100 prose-a:transition-colors hover:prose-a:border-indigo-600
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-code:bg-gray-100 prose-code:text-indigo-600 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                ">
                {page.contentType === 'markdown' && page.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-gray-800 flex items-center gap-3 after:content-[''] after:h-px after:flex-1 after:bg-gray-200" {...props} />,
                      ul: ({ node, ...props }) => <ul className="space-y-3 my-6 list-none" {...props} />,
                      li: ({ node, ...props }) => (
                        <li className="flex gap-3 items-start text-gray-600">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          <span className="flex-1">{props.children}</span>
                        </li>
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-8 rounded-xl border border-gray-100 shadow-sm">
                          <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                      th: ({ node, ...props }) => <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" {...props} />,
                      td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-t border-gray-100" {...props} />,
                    }}
                  >
                    {page.content}
                  </ReactMarkdown>
                ) : page.content ? (
                  <div
                    className="space-y-6"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-10">No content available</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

