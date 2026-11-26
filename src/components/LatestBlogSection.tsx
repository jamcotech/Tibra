import React from 'react';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogArticles';
import { useShop } from '../context/ShopContext';

export const LatestBlogSection: React.FC = () => {
  const { navigate } = useShop();

  // Pick top 3 latest published blog posts
  const latestPosts = [...BLOG_POSTS]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  return (
    <section id="latest-blog" className="py-16 sm:py-20 lg:py-24 bg-white border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-[#748C48]" />
              <span>Botanical Knowledge & Education</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-botanical-950 tracking-tight">
              Latest from Our Blog
            </h2>
            <p className="text-xs sm:text-sm text-botanical-800/80 max-w-xl">
              Evidence-based insights into herbal oils, traditional botanical wellness, and daily mobility care in Pakistan.
            </p>
          </div>

          <a
            href="/blog/"
            onClick={(e) => {
              e.preventDefault();
              navigate('blog');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#748C48] hover:text-[#5F7339] transition-colors group self-start sm:self-end"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {latestPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-cream-50/50 rounded-3xl p-6 sm:p-7 border border-cream-200 hover:border-botanical-300 transition-all duration-300 hover:shadow-luxury flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Category & Read Time */}
                <div className="flex items-center justify-between text-[11px] font-mono text-botanical-600">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-cream-200 font-semibold text-[#748C48]">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-base sm:text-lg text-botanical-950 group-hover:text-[#748C48] transition-colors line-clamp-2 leading-snug">
                  <a
                    href={`/blog/${post.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('blog-post', post.slug);
                    }}
                  >
                    {post.title}
                  </a>
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-botanical-800/80 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Footer row: Date & Read More */}
              <div className="pt-4 mt-6 border-t border-cream-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-botanical-500 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.publishDate}>{post.publishDate}</time>
                </div>

                <a
                  href={`/blog/${post.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('blog-post', post.slug);
                  }}
                  className="font-bold text-[#748C48] group-hover:text-[#5F7339] inline-flex items-center gap-1 text-[11px] uppercase tracking-wider"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
