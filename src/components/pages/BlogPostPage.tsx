import React from 'react';
import { Calendar, Clock, User, ChevronRight, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';
import { type BlogPost } from '../../data/blogArticles';

interface BlogPostPageProps {
  post: BlogPost;
  onBackToBlog: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onBackToBlog }) => {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: 'https://www.tibranaturals.com/assets/purefix-bottle-box-showcase.jpg',
    datePublished: post.publishDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://www.tibranaturals.com/'
    },
    publisher: {
      '@type': 'Organization',
      name: 'TIBRA NATURALS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tibranaturals.com/assets/tibra-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.tibranaturals.com/blog/${post.slug}/`
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.tibranaturals.com/blog/${post.slug}/` }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title={post.seoTitle}
        description={post.metaDescription}
        canonicalPath={`/blog/${post.slug}/`}
        ogType="article"
        schema={[articleSchema, breadcrumbSchema]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <button onClick={onBackToBlog} className="hover:text-botanical-950 transition-colors cursor-pointer">Blog</button>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold truncate max-w-[200px] sm:max-w-none" aria-current="page">{post.title}</span>
        </nav>

        <button
          type="button"
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#748C48] hover:text-[#5F7339] mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <article className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-cream-200 shadow-luxury space-y-6">
          <div className="space-y-3 pb-6 border-b border-cream-200">
            <span className="px-3 py-1 rounded-full bg-botanical-100 text-[#748C48] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-botanical-950 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-botanical-600 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-botanical-400" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-botanical-400" />
                {post.publishDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-botanical-400" />
                {post.readingTime}
              </span>
            </div>
          </div>

          {/* Key Takeaways Box */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-cream-200 space-y-2.5">
            <h3 className="font-serif font-bold text-sm text-botanical-950 uppercase tracking-wide">
              Key Insights &amp; Takeaways:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-botanical-800">
              {post.keyTakeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#748C48] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Body Content */}
          <div className="space-y-4 text-xs sm:text-sm md:text-base text-botanical-800 leading-relaxed font-normal">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* In-Article Contextual Product Link */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cream-50 via-white to-cream-50 border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-base text-botanical-950">Experience Pure Botanical Mobility</h4>
              <p className="text-xs text-botanical-700">Formulated with Turmeric, Ginger, Wintergreen &amp; Boswellia in a 30 ML dropper.</p>
            </div>
            <a
              href="/products/pain-relief-oil/"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-sm whitespace-nowrap flex items-center gap-2"
            >
              <span>View Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
