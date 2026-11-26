import { useState, useEffect, lazy, Suspense } from 'react';
import { ShopProvider, useShop, parsePathnameToView } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CartDrawer } from './components/CartDrawer';
import { SeoHead } from './components/SeoHead';
import { BLOG_POSTS } from './data/blogArticles';

// Code-split below-the-fold homepage sections to drastically minimize initial JavaScript execution & TBT
const ProductAnatomySection = lazy(() => import('./components/ProductAnatomySection').then(m => ({ default: m.ProductAnatomySection })));
const IngredientsSection = lazy(() => import('./components/IngredientsSection').then(m => ({ default: m.IngredientsSection })));
const BenefitsTargetSection = lazy(() => import('./components/BenefitsTargetSection').then(m => ({ default: m.BenefitsTargetSection })));
const PackagingShowcaseSection = lazy(() => import('./components/PackagingShowcaseSection').then(m => ({ default: m.PackagingShowcaseSection })));
const RitualUsageSection = lazy(() => import('./components/RitualUsageSection').then(m => ({ default: m.RitualUsageSection })));
const BrandStorySection = lazy(() => import('./components/BrandStorySection').then(m => ({ default: m.BrandStorySection })));
const LatestBlogSection = lazy(() => import('./components/LatestBlogSection').then(m => ({ default: m.LatestBlogSection })));
const FAQSection = lazy(() => import('./components/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCtaSection = lazy(() => import('./components/FinalCtaSection').then(m => ({ default: m.FinalCtaSection })));
const OrderInquiryModal = lazy(() => import('./components/OrderInquiryModal').then(m => ({ default: m.OrderInquiryModal })));

// Lazy-loaded routes to minimize initial JavaScript bundle execution and optimize LCP/FID/TBT
const SpreeAdminApp = lazy(() => import('./admin/SpreeAdminApp').then(m => ({ default: m.SpreeAdminApp })));
const CartPage = lazy(() => import('./components/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./components/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));

// Dedicated SEO Pages (Code-split)
const ProductsPage = lazy(() => import('./components/pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('./components/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const IngredientsPage = lazy(() => import('./components/pages/IngredientsPage').then(m => ({ default: m.IngredientsPage })));
const HowToUsePage = lazy(() => import('./components/pages/HowToUsePage').then(m => ({ default: m.HowToUsePage })));
const OurQualityPage = lazy(() => import('./components/pages/OurQualityPage').then(m => ({ default: m.OurQualityPage })));
const AboutUsPage = lazy(() => import('./components/pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const BlogHubPage = lazy(() => import('./components/pages/BlogHubPage').then(m => ({ default: m.BlogHubPage })));
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const FaqPage = lazy(() => import('./components/pages/FaqPage').then(m => ({ default: m.FaqPage })));
const ContactUsPage = lazy(() => import('./components/pages/ContactUsPage').then(m => ({ default: m.ContactUsPage })));
const PolicyPage = lazy(() => import('./components/pages/PolicyPage').then(m => ({ default: m.PolicyPage })));

function ShopAppContent() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { currentView, activeBlogSlug, navigate, isAdminOpen, setIsAdminOpen } = useShop();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, activeBlogSlug]);

  // Global click interceptor for internal routing links (e.g. footer links, breadcrumbs)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        !href.startsWith('/admin') &&
        !target.hasAttribute('download') &&
        target.target !== '_blank'
      ) {
        e.preventDefault();
        const resolved = parsePathnameToView(href);
        navigate(resolved.view, resolved.blogSlug);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [navigate]);

  if (isAdminOpen) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#252E15] flex items-center justify-center text-white font-mono text-sm">Loading Admin Portal...</div>}>
        <SpreeAdminApp
          onBackToStore={() => {
            setIsAdminOpen(false);
            window.location.hash = '';
            if (window.location.pathname.startsWith('/admin') || window.location.search.includes('admin')) {
              window.history.pushState({}, '', '/');
            }
          }}
        />
      </Suspense>
    );
  }

  const selectedPost = activeBlogSlug
    ? BLOG_POSTS.find(p => p.slug === activeBlogSlug) || BLOG_POSTS[0]
    : undefined;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#252E15] flex flex-col selection:bg-[#748C48] selection:text-white">
      {/* Navigation */}
      <Navbar onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <SeoHead
              title="TIBRA NATURALS | Herbal Oils & Natural Personal Care in Pakistan"
              description="Discover TIBRA NATURALS, Pakistan's authentic herbal wellness brand offering 100% natural botanical pain relief massage oils for joints, mobility, and everyday comfort."
              canonicalPath="/"
            />

            {/* Section 1: Cinematic Hero Reveal with High-Priority LCP Image */}
            <HeroSection onOpenOrderModal={() => setIsOrderModalOpen(true)} />

            {/* Below-the-fold sections wrapped in Suspense for zero main-thread blocking on initial paint */}
            <Suspense fallback={null}>
              {/* Section 2: 3D Product Anatomy & Motion */}
              <ProductAnatomySection />

              {/* Section 3: Verified Botanical Ingredients */}
              <IngredientsSection />

              {/* Section 4: Target Relief Areas & Verified Benefits */}
              <BenefitsTargetSection />

              {/* Section 5: Your Everyday Botanical Ritual Showcase & Order CTA */}
              <FinalCtaSection onOpenOrderModal={() => setIsOrderModalOpen(true)} />

              {/* Section 6: Official Box & Bottle Packaging Showcase */}
              <PackagingShowcaseSection />

              {/* Section 7: The Daily Application Ritual */}
              <RitualUsageSection />

              {/* Section 8: TIBRA NATURALS Brand Heritage */}
              <BrandStorySection />

              {/* Section 9: Latest from Our Blog Preview */}
              <LatestBlogSection />

              {/* Section 10: Frequently Asked Questions */}
              <FAQSection />
            </Suspense>
          </>
        )}

        {/* Dedicated Inner Pages (Suspense-wrapped code-split routes) */}
        <Suspense fallback={<div className="min-h-[50vh] bg-[#FAF8F5] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#748C48] border-t-transparent rounded-full animate-spin" /></div>}>
          {currentView === 'products' && (
            <ProductsPage onOpenOrderModal={() => setIsOrderModalOpen(true)} />
          )}
          {currentView === 'product-detail' && (
            <ProductDetailPage onOpenOrderModal={() => setIsOrderModalOpen(true)} />
          )}
          {currentView === 'ingredients' && <IngredientsPage />}
          {currentView === 'how-to-use' && <HowToUsePage />}
          {currentView === 'our-quality' && <OurQualityPage />}
          {currentView === 'about-us' && <AboutUsPage />}
          {currentView === 'faq' && <FaqPage />}
          {currentView === 'contact' && <ContactUsPage />}

          {/* Blog Views */}
          {currentView === 'blog' && (
            <BlogHubPage onSelectPost={(slug) => navigate('blog-post', slug)} />
          )}
          {currentView === 'blog-post' && selectedPost && (
            <BlogPostPage post={selectedPost} onBackToBlog={() => navigate('blog')} />
          )}

          {/* Policy Pages */}
          {currentView === 'policy-shipping' && <PolicyPage type="shipping" />}
          {currentView === 'policy-returns' && <PolicyPage type="returns" />}
          {currentView === 'policy-privacy' && <PolicyPage type="privacy" />}
          {currentView === 'policy-terms' && <PolicyPage type="terms" />}

          {/* Transactional Views */}
          {currentView === 'cart' && <CartPage />}
          {currentView === 'checkout' && <CheckoutPage />}
          {currentView === 'order-success' && <OrderSuccessPage />}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Sticky Bottom Bar (Slides in on scroll) */}
      <FloatingBottomBar />

      {/* Cart Sliding Drawer */}
      <CartDrawer />

      {/* Order / Inquiry Modal (Code-split on demand) */}
      <Suspense fallback={null}>
        {isOrderModalOpen && (
          <OrderInquiryModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
          />
        )}
      </Suspense>

      {/* Privacy-Compliant Cookie Consent Mode v2 Banner */}
      <CookieConsentBanner />
    </div>
  );
}

export function App() {
  return (
    <ShopProvider>
      <ShopAppContent />
    </ShopProvider>
  );
}

export default App;
