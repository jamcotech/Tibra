import React from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';
import { BLOG_POSTS } from '../../data/blogArticles';

interface BlogHubPageProps {
  onSelectPost: (slug: string) => void;
}

export const BlogHubPage: React.FC<BlogHubPageProps> = ({ onSelectPost }) => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="Herbal Wellness & Joint Care Blog | TIBRA NATURALS"
        description="Explore evidence-aware guides, botanical research, and practical advice on herbal massage oils, joint comfort, and active living from TIBRA NATURALS."
        canonicalPath="/blog/"
        schema={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">Blog</span>
        </nav>

        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Botanical Wellness Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            Herbal Wisdom &amp; Physical Care.
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
            Educational articles authored by the <strong>TIBRA NATURALS</strong> botanical advisory team on joint ease, topical oil application, and active living.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map(post => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-luxury flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-botanical-600">
                  <span className="px-2.5 py-0.5 rounded-full bg-botanical-100 text-[#748C48] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-botanical-400" />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-botanical-400" />
                      {post.readingTime}
                    </span>
                  </div>
                </div>

                <h2 className="font-serif font-bold text-lg sm:text-xl text-botanical-950 hover:text-[#748C48] transition-colors leading-snug">
                  <a
                    href={`/blog/${post.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectPost(post.slug);
                    }}
                  >
                    {post.title}
                  </a>
                </h2>

                <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
                <span className="text-[11px] text-botanical-600 font-medium">
                  By {post.author}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPost(post.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#748C48] hover:text-[#5F7339] cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogHubPage;
