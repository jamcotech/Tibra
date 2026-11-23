import { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
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

function ShopAppContent() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { currentView, isAdminOpen, setIsAdminOpen } = useShop();

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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#252E15] flex flex-col selection:bg-[#748C48] selection:text-white">
      {/* Navigation */}
      <Navbar onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
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

            {/* Section 8: Tibra Natural Brand Heritage */}
            <BrandStorySection />

            {/* Section 9: Frequently Asked Questions */}
            <FAQSection />
          </>
        )}

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
