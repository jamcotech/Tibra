import React, { useState, useEffect } from 'react';
import { Cookie, Settings, Check, X } from 'lucide-react';
import { metaPixelService } from '../services/metaPixelService';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'tibra_consent_state';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    // Check if user has already set preferences
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ConsentPreferences = JSON.parse(stored);
        setAnalyticsConsent(parsed.analytics);
        setMarketingConsent(parsed.marketing);
      } else {
        // Show banner after brief delay for smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }

    // Listen for custom event to re-open preferences from footer
    const handleReopen = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: ConsentPreferences = JSON.parse(stored);
          setAnalyticsConsent(parsed.analytics);
          setMarketingConsent(parsed.marketing);
        }
      } catch {}
      setIsCustomizeOpen(true);
      setIsVisible(true);
    };

    window.addEventListener('tibra_open_cookie_preferences', handleReopen);
    return () => window.removeEventListener('tibra_open_cookie_preferences', handleReopen);
  }, []);

  useEffect(() => {
    // Dispatch visibility event to prevent collision with mobile FloatingBottomBar
    window.dispatchEvent(
      new CustomEvent('tibra_consent_banner_visibility', {
        detail: { isVisible },
      })
    );
  }, [isVisible]);

  const applyConsent = (analytics: boolean, marketing: boolean) => {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // LocalStorage restricted fallback
    }

    // Update Google Consent Mode v2 via gtag
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: marketing ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
      });
    }

    // Push consent state event to GTM dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'consent_update',
        consent_analytics: analytics,
        consent_marketing: marketing,
      });
    }

    // Update Meta Pixel consent state
    if (marketing) {
      metaPixelService.grantConsent();
    } else {
      metaPixelService.revokeConsent();
    }

    setAnalyticsConsent(analytics);
    setMarketingConsent(marketing);
    setIsVisible(false);
    setIsCustomizeOpen(false);
  };

  const handleAcceptAll = () => applyConsent(true, true);
  const handleRejectAll = () => applyConsent(false, false);
  const handleSaveCustom = () => applyConsent(analyticsConsent, marketingConsent);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-2.5 sm:p-6 pointer-events-none pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-cream-300 shadow-2xl p-4 sm:p-7 pointer-events-auto text-[#252E15] transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#748C48]/15 text-[#748C48] flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#252E15]">
                Cookie &amp; Privacy Preferences
              </h3>
              <p className="text-[11px] text-[#252E15]/70">
                TIBRA NATURALS values your transparency and privacy
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isCustomizeOpen ? (
          <div className="py-4 space-y-3 text-xs leading-relaxed text-[#252E15]/85">
            <p>
              We use essential cookies to maintain site functionality, cart sessions, and secure checkout. With your consent, we also collect anonymized performance and analytics cookies to improve botanical wellness guides and user rituals.
            </p>
            <p className="text-[11px] text-[#252E15]/70">
              Learn more in our{' '}
              <a href="/privacy-policy/" className="text-[#748C48] underline font-medium hover:text-[#5F7339]">
                Privacy Policy
              </a>.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-3.5 text-xs">
            {/* Essential Category */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-cream-200">
              <div className="pr-4">
                <span className="font-bold block text-sm text-[#252E15]">Strictly Necessary</span>
                <span className="text-[11px] text-[#252E15]/70">
                  Required for site navigation, security, and cart checkout. Cannot be disabled.
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#748C48] bg-white px-2.5 py-1 rounded-lg border border-cream-300">
                Always Active
              </span>
            </div>

            {/* Analytics Category */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-cream-200">
              <div className="pr-4">
                <span className="font-bold block text-sm text-[#252E15]">Analytics &amp; Performance</span>
                <span className="text-[11px] text-[#252E15]/70">
                  Helps us understand reader journeys and optimize store performance via anonymized metrics.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#748C48]"></div>
              </label>
            </div>

            {/* Marketing Category */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-cream-200">
              <div className="pr-4">
                <span className="font-bold block text-sm text-[#252E15]">Marketing &amp; Personalization</span>
                <span className="text-[11px] text-[#252E15]/70">
                  Enables marketing attribution and campaign measurement (e.g. Meta Pixel) without transmitting sensitive health information.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#748C48]"></div>
              </label>
            </div>
          </div>
        )}

        {/* Buttons / Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {!isCustomizeOpen ? (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(true)}
                className="w-full sm:w-auto text-xs font-semibold text-[#252E15]/75 hover:text-[#252E15] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize Choices</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full text-xs font-bold border border-cream-300 text-[#252E15]/80 hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md transition-all cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(false)}
                className="w-full sm:w-auto text-xs font-semibold text-[#252E15]/75 hover:text-[#252E15] py-2 px-3 rounded-xl hover:bg-cream-100 transition-colors cursor-pointer"
              >
                &larr; Back
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full text-xs font-bold border border-cream-300 text-[#252E15]/80 hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  Reject All Optional
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Choices</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default CookieConsentBanner;
