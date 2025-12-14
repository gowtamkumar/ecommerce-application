import appConfig from "@/appConfig";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { getPageBySlug } from "@/lib/apis/page";
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
    title: page.title,
    description: page.metaDescription || page.title,
    metadataBase: new URL(appConfig.baseUrl as any),
    openGraph: {
      title: page.title,
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-blue-100/20"></div>

        <div className="relative z-10">
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Page Content Card */}
            <article className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl p-8 md:p-12 shadow-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                {page.title}
              </h1>

              <div className="prose prose-lg max-w-none">
                {page.contentType === 'markdown' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                      a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 text-gray-700" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 text-gray-700" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                    }}
                  >
                    {page.content}
                  </ReactMarkdown>
                ) : (
                  <div
                    className="page-html-content text-gray-700"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
      <WebFooter />
    </>
  );
}
