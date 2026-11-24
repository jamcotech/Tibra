import { useState, useEffect } from 'react';
import { ShopProvider, useShop, parsePathnameToView } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductAnatomySection } from './components/ProductAnatomySection';
import { IngredientsSection } from './components/IngredientsSection';
import { BenefitsTargetSection } from './components/BenefitsTargetSection';
import { PackagingShowcaseSection } from './components/PackagingShowcaseSection';
import { RitualUsageSection } from './components/RitualUsageSection';
import { BrandStorySection } from './components/BrandStorySection';
import { FAQSection } from './components/FAQSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { OrderInquiryModal } from './components/OrderInquiryModal';
import { CartDrawer } from './components/CartDrawer';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { SpreeAdminApp } from './admin/SpreeAdminApp';
import { SeoHead } from './components/SeoHead';

// Dedicated SEO Pages
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { IngredientsPage } from './components/pages/IngredientsPage';
import { HowToUsePage } from './components/pages/HowToUsePage';
import { OurQualityPage } from './components/pages/OurQualityPage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { BlogHubPage } from './components/pages/BlogHubPage';
import { BlogPostPage } from './components/pages/BlogPostPage';
import { FaqPage } from './components/pages/FaqPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { PolicyPage } from './components/pages/PolicyPage';
import { BLOG_POSTS } from './data/blogArticles';

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
      <SpreeAdminApp
        onBackToStore={() => {
          setIsAdminOpen(false);
          window.location.hash = '';
          if (window.location.pathname.startsWith('/admin') || window.location.search.includes('admin')) {
            window.history.pushState({}, '', '/');
          }
        }}
      />
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

            {/* Section 1: Cinematic Hero Reveal with Animated Video & Bottle */}
            <HeroSection onOpenOrderModal={() => setIsOrderModalOpen(true)} />

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

            {/* Section 9: Frequently Asked Questions */}
            <FAQSection />
          </>
        )}

        {/* Dedicated Inner Pages */}
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
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Sticky Bottom Bar (Slides in on scroll) */}
      <FloatingBottomBar />

      {/* Cart Sliding Drawer */}
      <CartDrawer />

      {/* Order / Inquiry Modal */}
      <OrderInquiryModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
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
