import React from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText, ChevronRight } from 'lucide-react';
import { SeoHead } from '../SeoHead';

export type PolicyType = 'shipping' | 'returns' | 'privacy' | 'terms';

interface PolicyPageProps {
  type: PolicyType;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const configs: Record<PolicyType, {
    title: string;
    seoTitle: string;
    description: string;
    canonicalPath: string;
    icon: React.ElementType;
    sections: Array<{ heading: string; body: string }>;
  }> = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      seoTitle: 'Shipping & Delivery Policy | TIBRA NATURALS Pakistan',
      description: 'Nationwide shipping policy for TIBRA NATURALS across Pakistan. Cash on Delivery (COD), Rs. 200 flat courier rate, and 2-4 business day dispatch.',
      canonicalPath: '/shipping-policy/',
      icon: Truck,
      sections: [
        {
          heading: '1. Nationwide Courier Coverage',
          body: 'TIBRA NATURALS delivers nationwide across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and all regional districts via premier courier partners.'
        },
        {
          heading: '2. Flat Shipping Fee & Cash on Delivery (COD)',
          body: 'We maintain a transparent flat delivery fee of Rs. 200 per order across all cities. All orders are eligible for Cash on Delivery (COD), allowing you to pay in cash upon receiving your package at your doorstep.'
        },
        {
          heading: '3. Order Dispatch & Delivery Timelines',
          body: 'Orders placed before 4:00 PM (PKT) are processed and dispatched on the same business day from our primary warehouse in Lahore. Major urban centers typically receive delivery within 2 to 3 business days; regional and remote destinations take 3 to 5 business days.'
        },
        {
          heading: '4. Tracking & Verification',
          body: 'Upon courier booking, a tracking ID is sent via SMS and WhatsApp. You can track your parcel in real-time or inquire directly through our customer support desk.'
        }
      ]
    },
    returns: {
      title: 'Returns & Replacement Policy',
      seoTitle: 'Returns & Replacement Policy | TIBRA NATURALS',
      description: 'Inspection on delivery, damaged item replacement, and 7-day customer satisfaction commitment for TIBRA NATURALS botanical wellness orders in Pakistan.',
      canonicalPath: '/return-policy/',
      icon: RotateCcw,
      sections: [
        {
          heading: '1. Parcel Inspection & Integrity',
          body: 'Every bottle of TIBRA NATURALS Pain Relief Oil is factory inspected and security-sealed. We encourage all customers to inspect the outer shipping flyer upon delivery before signing.'
        },
        {
          heading: '2. Damaged or Broken in Transit Replacement',
          body: 'If your amber glass bottle arrives broken, leaking, or damaged during transit, notify our customer care team via WhatsApp (+92 300 1234567) within 48 hours with a photograph of the damaged parcel. We will immediately dispatch a fresh replacement at zero cost.'
        },
        {
          heading: '3. 7-Day Replacement Window',
          body: 'Unopened, sealed bottles in original unit packaging can be returned or exchanged within 7 days of delivery. Due to the personal topical nature of botanical wellness formulations, opened or used bottles cannot be returned for hygiene and safety reasons.'
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      seoTitle: 'Privacy Policy | TIBRA NATURALS',
      description: 'Privacy Policy for TIBRA NATURALS. We respect customer privacy, protect personal delivery data, and never sell or rent your personal information.',
      canonicalPath: '/privacy-policy/',
      icon: ShieldCheck,
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'When you place an order or contact us, we collect necessary shipping data including your name, delivery address, phone number, and optional email address solely to fulfill courier delivery.'
        },
        {
          heading: '2. Use of Information',
          body: 'Your information is used strictly to process orders, communicate delivery status, and provide customer support. We never sell, rent, or trade customer contact details to third-party marketing brokers.'
        },
        {
          heading: '3. Data Security & Storage',
          body: 'We implement industry-standard encryption protocols and secure internal access controls to safeguard your transaction and delivery records.'
        },
        {
          heading: '4. Cookies & Advertising Measurement (Google Analytics & Meta Pixel)',
          body: 'We use necessary cookies to maintain your shopping cart and secure checkout session. Subject to your explicit consent, we may use first-party analytics (Google Analytics) and privacy-gated marketing measurement (Meta Pixel) to analyze aggregate store performance and measure advertising campaigns. In accordance with Meta Business Tools Terms and data privacy standards, we strictly prohibit the transmission of sensitive health conditions, medical details, customer contact information, or personal identifiers.'
        },
        {
          heading: '5. Managing and Revoking Cookie Consent',
          body: 'You retain full control over non-essential cookies. Non-essential analytics and marketing tracking remain disabled by default. You can accept, customize, or revoke your cookie choices at any time by clicking "Cookie Preferences" located in our website footer.'
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      seoTitle: 'Terms & Conditions | TIBRA NATURALS',
      description: 'Terms and conditions governing the use of the official TIBRA NATURALS website, product purchases, and wellness disclaimers.',
      canonicalPath: '/terms-and-conditions/',
      icon: FileText,
      sections: [
        {
          heading: '1. Agreement to Terms',
          body: 'By accessing https://www.tibranaturals.com/ and placing an order, you agree to comply with our commercial terms, privacy standards, and wellness usage guidelines.'
        },
        {
          heading: '2. Product Formulation & Wellness Disclaimer',
          body: 'TIBRA NATURALS Pain Relief Oil is a topical herbal wellness oil intended for physical comfort, massage, and mobility support. It is not formulated to diagnose, cure, treat, or prevent any medical disease or condition.'
        },
        {
          heading: '3. Pricing & Order Acceptance',
          body: 'All prices are quoted in Pakistani Rupees (PKR). We reserve the right to verify, confirm, or cancel orders in cases of suspicious activity or address discrepancies.'
        }
      ]
    }
  };

  const current = configs[type];
  const Icon = current.icon;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: current.title, item: `https://www.tibranaturals.com${current.canonicalPath}` }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title={current.seoTitle}
        description={current.description}
        canonicalPath={current.canonicalPath}
        schema={breadcrumbSchema}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">{current.title}</span>
        </nav>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-luxury space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-botanical-950">
                {current.title}
              </h1>
              <p className="text-xs text-botanical-600 mt-0.5">
                Last updated: November 24, 2026 • Official TIBRA NATURALS Policy
              </p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-botanical-800 leading-relaxed">
            {current.sections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h2 className="font-serif font-bold text-base text-botanical-950">
                  {sec.heading}
                </h2>
                <p>{sec.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
