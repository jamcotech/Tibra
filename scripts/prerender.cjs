const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found! Run build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const routes = [
  {
    path: '/track-order/',
    title: 'Live Order & Shipment Tracking | TIBRA NATURALS Pakistan',
    description: 'Track your TIBRA NATURALS order and live parcel delivery across Pakistan. Enter your Order Number and mobile number for real-time courier checkpoints.',
    h1: 'Live Order & Shipment Tracking – TIBRA NATURALS Pakistan',
    content: 'Track your TIBRA NATURALS botanical order online. Enter your order number and mobile phone to view real-time delivery status, courier milestones across TCS, PostEx, Leopards, and estimated arrival in Pakistan.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Live Order & Shipment Tracking | TIBRA NATURALS Pakistan',
          url: 'https://www.tibranaturals.com/track-order/',
          description: 'Track your TIBRA NATURALS order and live parcel delivery across Pakistan. Enter your Order Number and mobile number for real-time courier checkpoints.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Track Order', item: 'https://www.tibranaturals.com/track-order/' }
          ]
        }
      ]
    }
  },
  {
    path: '/products/',
    title: 'Our Herbal Products | TIBRA NATURALS Pakistan',
    description: 'Explore authentic botanical wellness formulations from TIBRA NATURALS Pakistan. 100% natural herbal joint comfort and massage oils.',
    h1: 'Our Herbal Products – Natural Relief for Active Living',
    content: 'Explore authentic botanical massage oils handcrafted with 100% natural extracts. Cold-extracted, sealed in UV-protective amber glass, and delivered with Cash on Delivery across Pakistan.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'Our Herbal Products | TIBRA NATURALS Pakistan',
          url: 'https://www.tibranaturals.com/products/',
          description: 'Explore authentic botanical wellness formulations from TIBRA NATURALS Pakistan. 100% natural herbal joint comfort and massage oils.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'TIBRA NATURALS Pain Relief Oil – 30ml',
                url: 'https://www.tibranaturals.com/products/pain-relief-oil/'
              }
            ]
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.tibranaturals.com/products/' }
          ]
        }
      ]
    }
  },
  {
    path: '/products/pain-relief-oil/',
    title: 'TIBRA NATURALS Pain Relief Oil | Herbal Massage Oil 30ml Pakistan',
    description: 'Buy authentic TIBRA NATURALS Pain Relief Oil (30ml). 100% natural herbal formula with Turmeric, Ginger & Boswellia. Cash on Delivery across Pakistan. Rs. 1,500.',
    h1: 'TIBRA NATURALS Pain Relief Oil – 30ml',
    content: 'Authentic 100% natural herbal blend formulated with Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility and soothing joint massage in Pakistan.',
    preloadImage: '/assets/tibra-bottle-transparent.webp',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: 'TIBRA NATURALS Pain Relief Oil',
          image: [
            'https://www.tibranaturals.com/assets/tibra-bottle-box-showcase.webp',
            'https://www.tibranaturals.com/assets/packaging-showcase-003.webp'
          ],
          description: '100% Natural Herbal Topical Blend formulated with Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for soothing joint and muscle massage.',
          sku: 'TN-PRO-030',
          brand: { '@type': 'Brand', name: 'TIBRA NATURALS' },
          offers: [
            {
              '@type': 'Offer',
              name: 'Single Bottle (30ml)',
              url: 'https://www.tibranaturals.com/products/pain-relief-oil/',
              priceCurrency: 'PKR',
              price: '1500',
              priceValidUntil: '2027-12-31',
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/InStock',
              seller: { '@type': 'Organization', name: 'TIBRA NATURALS' }
            },
            {
              '@type': 'Offer',
              name: 'Duo Pack (2 Bottles - 60ml Total)',
              url: 'https://www.tibranaturals.com/products/pain-relief-oil/',
              priceCurrency: 'PKR',
              price: '2600',
              priceValidUntil: '2027-12-31',
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/InStock',
              seller: { '@type': 'Organization', name: 'TIBRA NATURALS' }
            }
          ]
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.tibranaturals.com/products/' },
            { '@type': 'ListItem', position: 3, name: 'Pain Relief Oil', item: 'https://www.tibranaturals.com/products/pain-relief-oil/' }
          ]
        }
      ]
    }
  },
  {
    path: '/ingredients/',
    title: 'Botanical Ingredients | TIBRA NATURALS Pain Relief Oil',
    description: 'Discover the 100% natural botanical ingredients in TIBRA NATURALS Pain Relief Oil: Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility.',
    h1: 'Formulated from the Earth: 100% Botanical Transparency',
    content: 'Curcuma Longa (Turmeric Root), Zingiber Officinale (Ginger Root), Gaultheria Procumbens (Wintergreen), Eucalyptus Globulus Leaf Oil, Boswellia Serrata (Frankincense Resin).',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Botanical Ingredients | TIBRA NATURALS Pain Relief Oil',
          url: 'https://www.tibranaturals.com/ingredients/',
          description: 'Discover the 100% natural botanical ingredients in TIBRA NATURALS Pain Relief Oil: Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Ingredients', item: 'https://www.tibranaturals.com/ingredients/' }
          ]
        }
      ]
    }
  },
  {
    path: '/how-to-use/',
    title: 'How to Use Herbal Massage Oil | TIBRA NATURALS Daily Ritual',
    description: 'Learn how to properly apply TIBRA NATURALS Pain Relief Oil. Step-by-step 30 ML dropper dosage, circular massage instructions, and precautions for best joint relief.',
    h1: 'A Mindful Daily Ritual: Directions for Optimal Comfort',
    content: 'Dispense 3 to 5 warm drops directly onto clean skin. Massage in gentle circular motions for 2 to 3 minutes twice daily.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'How to Use Herbal Massage Oil | TIBRA NATURALS Daily Ritual',
          url: 'https://www.tibranaturals.com/how-to-use/',
          description: 'Learn how to properly apply TIBRA NATURALS Pain Relief Oil. Step-by-step 30 ML dropper dosage, circular massage instructions, and precautions for best joint relief.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'How to Use', item: 'https://www.tibranaturals.com/how-to-use/' }
          ]
        }
      ]
    }
  },
  {
    path: '/our-quality/',
    title: 'Quality & Sourcing Standards | TIBRA NATURALS Pakistan',
    description: 'Learn how TIBRA NATURALS ensures uncompromised herbal quality. Cold-extraction, pharmaceutical amber glass UV defense, and verified botanical purity.',
    h1: 'Uncompromising Standards: From Soil to Dropper',
    content: 'Gentle cold-maceration, pharmaceutical amber glass UV defense, zero synthetic fillers, and strict batch safety inspection.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Quality & Sourcing Standards | TIBRA NATURALS Pakistan',
          url: 'https://www.tibranaturals.com/our-quality/',
          description: 'Learn how TIBRA NATURALS ensures uncompromised herbal quality. Cold-extraction, pharmaceutical amber glass UV defense, and verified botanical purity.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Quality Standards', item: 'https://www.tibranaturals.com/our-quality/' }
          ]
        }
      ]
    }
  },
  {
    path: '/about-us/',
    title: 'About Us | TIBRA NATURALS – Botanical Wellness Heritage',
    description: 'Learn about TIBRA NATURALS, Pakistan’s authentic botanical wellness house dedicated to 100% natural herbal joint comfort, mobility rituals, and uncompromised purity.',
    h1: 'Rooted in Nature: Crafted for Active Living',
    content: 'At TIBRA NATURALS, we believe genuine wellness starts where synthetic shortcuts end. Dedicated to authentic botanical joint comfort in Pakistan.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          name: 'About Us | TIBRA NATURALS – Botanical Wellness Heritage',
          url: 'https://www.tibranaturals.com/about-us/',
          description: 'Learn about TIBRA NATURALS, Pakistan’s authentic botanical wellness house dedicated to 100% natural herbal joint comfort, mobility rituals, and uncompromised purity.',
          mainEntity: {
            '@type': 'Organization',
            name: 'TIBRA NATURALS',
            url: 'https://www.tibranaturals.com/'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://www.tibranaturals.com/about-us/' }
          ]
        }
      ]
    }
  },
  {
    path: '/blog/',
    title: 'Herbal Wellness & Joint Care Blog | TIBRA NATURALS',
    description: 'Explore evidence-aware guides, botanical research, and practical advice on herbal massage oils, joint comfort, and active living from TIBRA NATURALS.',
    h1: 'Herbal Wisdom & Physical Care: Botanical Wellness Journal',
    content: 'Educational articles authored by the TIBRA NATURALS botanical advisory team on joint ease, topical oil application, and active living.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'Herbal Wellness & Joint Care Blog | TIBRA NATURALS',
          url: 'https://www.tibranaturals.com/blog/',
          description: 'Explore evidence-aware guides, botanical research, and practical advice on herbal massage oils, joint comfort, and active living from TIBRA NATURALS.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'A Comprehensive Guide to Herbal Massage Oils for Joint and Muscle Comfort',
                url: 'https://www.tibranaturals.com/blog/herbal-massage-oil-guide/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Natural Botanical Oils in Modern Personal Care: Ancient Wisdom Meets Daily Living',
                url: 'https://www.tibranaturals.com/blog/natural-oils-and-personal-care/'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Understanding Herbal Ingredients: Turmeric, Ginger, and Boswellia in Topical Formulations',
                url: 'https://www.tibranaturals.com/blog/understanding-herbal-ingredients/'
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: 'Safe Use and Best Practices for Topical Botanical Oils',
                url: 'https://www.tibranaturals.com/blog/safe-use-of-topical-oils/'
              }
            ]
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' }
          ]
        }
      ]
    }
  },
  {
    path: '/blog/herbal-massage-oil-guide/',
    title: 'Herbal Massage Oil Guide for Joints & Muscles | TIBRA NATURALS',
    description: 'Discover how herbal massage oils provide natural joint comfort and muscle relaxation. Learn about botanical synergy, cold-maceration, and optimal application techniques.',
    h1: 'A Comprehensive Guide to Herbal Massage Oils for Joint and Muscle Comfort',
    content: 'Topical massage oils deliver phytocompounds directly to stiff joint tissues through gentle friction massage, stimulating local microcirculation.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: 'A Comprehensive Guide to Herbal Massage Oils for Joint and Muscle Comfort',
          description: 'Discover how herbal massage oils provide natural joint comfort and muscle relaxation. Learn about botanical synergy, cold-maceration, and optimal application techniques.',
          url: 'https://www.tibranaturals.com/blog/herbal-massage-oil-guide/',
          image: 'https://www.tibranaturals.com/assets/packaging-showcase-003.webp',
          datePublished: '2026-10-15T09:00:00+05:00',
          dateModified: '2026-11-20T14:30:00+05:00',
          author: { '@type': 'Organization', name: 'TIBRA NATURALS Botanical Editorial Team' },
          publisher: {
            '@type': 'Organization',
            name: 'TIBRA NATURALS',
            logo: { '@type': 'ImageObject', url: 'https://www.tibranaturals.com/assets/tibra-logo.png' }
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tibranaturals.com/blog/herbal-massage-oil-guide/' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' },
            { '@type': 'ListItem', position: 3, name: 'Herbal Massage Oil Guide', item: 'https://www.tibranaturals.com/blog/herbal-massage-oil-guide/' }
          ]
        }
      ]
    }
  },
  {
    path: '/blog/natural-oils-and-personal-care/',
    title: 'Natural Oils & Botanical Personal Care | TIBRA NATURALS',
    description: 'Explore why natural botanical oils are replacing synthetic products in modern personal care and joint wellness rituals in Pakistan and worldwide.',
    h1: 'Natural Botanical Oils in Modern Personal Care: Ancient Wisdom Meets Daily Living',
    content: 'Consumers across Pakistan and internationally are rejecting synthetic parabens and artificial fragrance enhancers in favor of clean botanical oils.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: 'Natural Botanical Oils in Modern Personal Care: Ancient Wisdom Meets Daily Living',
          description: 'Explore why natural botanical oils are replacing synthetic products in modern personal care and joint wellness rituals in Pakistan and worldwide.',
          url: 'https://www.tibranaturals.com/blog/natural-oils-and-personal-care/',
          image: 'https://www.tibranaturals.com/assets/packaging-showcase-003.webp',
          datePublished: '2026-10-18T10:00:00+05:00',
          dateModified: '2026-11-20T14:30:00+05:00',
          author: { '@type': 'Organization', name: 'TIBRA NATURALS Botanical Editorial Team' },
          publisher: {
            '@type': 'Organization',
            name: 'TIBRA NATURALS',
            logo: { '@type': 'ImageObject', url: 'https://www.tibranaturals.com/assets/tibra-logo.png' }
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tibranaturals.com/blog/natural-oils-and-personal-care/' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' },
            { '@type': 'ListItem', position: 3, name: 'Natural Oils in Personal Care', item: 'https://www.tibranaturals.com/blog/natural-oils-and-personal-care/' }
          ]
        }
      ]
    }
  },
  {
    path: '/blog/understanding-herbal-ingredients/',
    title: 'Herbal Ingredients: Turmeric, Ginger & Boswellia | TIBRA NATURALS',
    description: 'Learn about the verified roles of Turmeric, Ginger, and Boswellia (Frankincense) in topical massage oils. Discover how botanical synergy eases joint stiffness.',
    h1: 'Understanding Herbal Ingredients: Turmeric, Ginger, and Boswellia in Topical Formulations',
    content: 'Curcuma Longa delivers curcuminoids, Zingiber Officinale provides gentle thermogenic warming, and Boswellia Serrata supports joint cushion feel.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: 'Understanding Herbal Ingredients: Turmeric, Ginger, and Boswellia in Topical Formulations',
          description: 'Learn about the verified roles of Turmeric, Ginger, and Boswellia (Frankincense) in topical massage oils. Discover how botanical synergy eases joint stiffness.',
          url: 'https://www.tibranaturals.com/blog/understanding-herbal-ingredients/',
          image: 'https://www.tibranaturals.com/assets/packaging-showcase-003.webp',
          datePublished: '2026-10-22T11:00:00+05:00',
          dateModified: '2026-11-20T14:30:00+05:00',
          author: { '@type': 'Organization', name: 'TIBRA NATURALS Botanical Editorial Team' },
          publisher: {
            '@type': 'Organization',
            name: 'TIBRA NATURALS',
            logo: { '@type': 'ImageObject', url: 'https://www.tibranaturals.com/assets/tibra-logo.png' }
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tibranaturals.com/blog/understanding-herbal-ingredients/' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' },
            { '@type': 'ListItem', position: 3, name: 'Understanding Herbal Ingredients', item: 'https://www.tibranaturals.com/blog/understanding-herbal-ingredients/' }
          ]
        }
      ]
    }
  },
  {
    path: '/blog/safe-use-of-topical-oils/',
    title: 'Safe Use of Topical Herbal Oils | TIBRA NATURALS Guidelines',
    description: 'Essential safety guidelines, patch test protocols, storage recommendations, and proper application dosage for botanical massage oils.',
    h1: 'Safe Use and Best Practices for Topical Botanical Oils',
    content: 'Always conduct a 24-hour forearm patch test before regular application. Never apply to broken skin, and store amber glass bottles in a cool, dry area.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: 'Safe Use and Best Practices for Topical Botanical Oils',
          description: 'Essential safety guidelines, patch test protocols, storage recommendations, and proper application dosage for botanical massage oils.',
          url: 'https://www.tibranaturals.com/blog/safe-use-of-topical-oils/',
          image: 'https://www.tibranaturals.com/assets/packaging-showcase-003.webp',
          datePublished: '2026-10-25T11:30:00+05:00',
          dateModified: '2026-11-20T14:30:00+05:00',
          author: { '@type': 'Organization', name: 'TIBRA NATURALS Botanical Editorial Team' },
          publisher: {
            '@type': 'Organization',
            name: 'TIBRA NATURALS',
            logo: { '@type': 'ImageObject', url: 'https://www.tibranaturals.com/assets/tibra-logo.png' }
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tibranaturals.com/blog/safe-use-of-topical-oils/' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tibranaturals.com/blog/' },
            { '@type': 'ListItem', position: 3, name: 'Safe Use of Topical Oils', item: 'https://www.tibranaturals.com/blog/safe-use-of-topical-oils/' }
          ]
        }
      ]
    }
  },
  {
    path: '/faq/',
    title: 'Frequently Asked Questions (FAQ) | TIBRA NATURALS',
    description: 'Got questions about TIBRA NATURALS Pain Relief Oil? Find answers regarding ingredients, 30 ML dropper dosage, shipping across Pakistan, and COD payments.',
    h1: 'Frequently Asked Questions: TIBRA NATURALS Support & Guidance',
    content: 'Frequently asked questions regarding 30 ML packaging, verified botanical ingredients, twice-daily application rituals, and nationwide COD delivery across Pakistan.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is TIBRA NATURALS Pain Relief Oil?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'TIBRA NATURALS Pain Relief Oil is a 100% natural herbal massage oil handcrafted with 16 botanical extracts and essential oils including Turmeric, Ginger, Wintergreen, Eucalyptus, and Boswellia, designed for soothing joint and muscle comfort.'
              }
            },
            {
              '@type': 'Question',
              name: 'How do I apply TIBRA NATURALS Pain Relief Oil?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Dispense 3 to 5 warm drops directly onto clean skin over the affected joint or muscle. Gently massage in circular motions for 2 to 3 minutes until absorbed. For optimal comfort, apply twice daily.'
              }
            },
            {
              '@type': 'Question',
              name: 'Is Cash on Delivery (COD) available across Pakistan?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, we provide nationwide Cash on Delivery (COD) to all cities and towns in Pakistan with a flat courier fee of Rs. 200.'
              }
            },
            {
              '@type': 'Question',
              name: 'What bottle size is available?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'TIBRA NATURALS Pain Relief Oil is packaged in a 30 ML pharmaceutical amber glass bottle with UV protection and a precision dropper cap.'
              }
            }
          ]
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://www.tibranaturals.com/faq/' }
          ]
        }
      ]
    }
  },
  {
    path: '/contact-us/',
    title: 'Contact Us | TIBRA NATURALS Customer Support Pakistan',
    description: 'Get in touch with TIBRA NATURALS Pakistan. Customer care, WhatsApp order reservations, delivery inquiries, and verified business address.',
    h1: 'Contact TIBRA NATURALS: Dedicated Support & Inquiries',
    content: 'Connect with TIBRA NATURALS support desk via WhatsApp, email orders@tibranaturals.com, or direct customer care in Lahore, Pakistan.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          name: 'Contact Us | TIBRA NATURALS Customer Support Pakistan',
          url: 'https://www.tibranaturals.com/contact-us/',
          description: 'Get in touch with TIBRA NATURALS Pakistan. Customer care, WhatsApp order reservations, delivery inquiries, and verified business address.',
          mainEntity: {
            '@type': 'Organization',
            name: 'TIBRA NATURALS',
            url: 'https://www.tibranaturals.com/',
            logo: 'https://www.tibranaturals.com/assets/tibra-logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+92-300-1234567',
              contactType: 'customer service',
              email: 'orders@tibranaturals.com',
              areaServed: 'PK',
              availableLanguage: ['English', 'Urdu']
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Lahore',
              addressRegion: 'Punjab',
              postalCode: '54000',
              addressCountry: 'PK'
            }
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://www.tibranaturals.com/contact-us/' }
          ]
        }
      ]
    }
  },
  {
    path: '/shipping-policy/',
    title: 'Shipping & Delivery Policy | TIBRA NATURALS Pakistan',
    description: 'Nationwide shipping policy for TIBRA NATURALS across Pakistan. Cash on Delivery (COD), Rs. 200 flat courier rate, and 2-4 business day dispatch.',
    h1: 'Shipping & Delivery Policy',
    content: 'Nationwide courier delivery across Pakistan with flat Rs. 200 shipping fee and Cash on Delivery (COD) eligibility.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Shipping & Delivery Policy | TIBRA NATURALS Pakistan',
          url: 'https://www.tibranaturals.com/shipping-policy/',
          description: 'Nationwide shipping policy for TIBRA NATURALS across Pakistan. Cash on Delivery (COD), Rs. 200 flat courier rate, and 2-4 business day dispatch.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Shipping Policy', item: 'https://www.tibranaturals.com/shipping-policy/' }
          ]
        }
      ]
    }
  },
  {
    path: '/return-policy/',
    title: 'Returns & Replacement Policy | TIBRA NATURALS',
    description: 'Inspection on delivery, damaged item replacement, and 7-day customer satisfaction commitment for TIBRA NATURALS botanical wellness orders in Pakistan.',
    h1: 'Returns & Replacement Policy',
    content: 'Inspection on delivery, damaged in transit free replacement within 48 hours, and 7-day unopened return satisfaction commitment.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Returns & Replacement Policy | TIBRA NATURALS',
          url: 'https://www.tibranaturals.com/return-policy/',
          description: 'Inspection on delivery, damaged item replacement, and 7-day customer satisfaction commitment for TIBRA NATURALS botanical wellness orders in Pakistan.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Return Policy', item: 'https://www.tibranaturals.com/return-policy/' }
          ]
        }
      ]
    }
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy | TIBRA NATURALS',
    description: 'Privacy Policy for TIBRA NATURALS. We respect customer privacy, protect personal delivery data, and never sell or rent your personal information.',
    h1: 'Privacy Policy',
    content: 'We collect necessary delivery information solely to fulfill courier shipping. We never sell or rent customer data. Subject to explicit consent, privacy-gated analytics (Google Analytics) and advertising measurement (Meta Pixel) are used without transmitting sensitive health information.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Privacy Policy | TIBRA NATURALS',
          url: 'https://www.tibranaturals.com/privacy-policy/',
          description: 'Privacy Policy for TIBRA NATURALS. We respect customer privacy, protect personal delivery data, and never sell or rent your personal information.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://www.tibranaturals.com/privacy-policy/' }
          ]
        }
      ]
    }
  },
  {
    path: '/terms-and-conditions/',
    title: 'Terms & Conditions | TIBRA NATURALS',
    description: 'Terms and conditions governing the use of the official TIBRA NATURALS website, product purchases, and wellness disclaimers.',
    h1: 'Terms & Conditions',
    content: 'Commercial terms governing purchases of TIBRA NATURALS Pain Relief Oil and topical wellness formulation disclaimers.',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Terms & Conditions | TIBRA NATURALS',
          url: 'https://www.tibranaturals.com/terms-and-conditions/',
          description: 'Terms and conditions governing the use of the official TIBRA NATURALS website, product purchases, and wellness disclaimers.'
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Terms & Conditions', item: 'https://www.tibranaturals.com/terms-and-conditions/' }
          ]
        }
      ]
    }
  }
];

console.log(`Generating pre-rendered static HTML routes for ${routes.length} deep paths (plus root dist/index.html = ${routes.length + 1} total sitemap canonical URLs)...`);

routes.forEach((route) => {
  const canonicalUrl = `https://www.tibranaturals.com${route.path}`;
  let html = baseHtml;

  // Replace Title (using function replacer to prevent special character interpretation)
  html = html.replace(/<title>.*?<\/title>/s, () => `<title>${route.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/s,
    () => `<meta name="description" content="${route.description}" />`
  );

  // Replace Meta Title
  html = html.replace(
    /<meta name="title" content=".*?" \/>/s,
    () => `<meta name="title" content="${route.title}" />`
  );

  // Replace Canonical Tag
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/s,
    () => `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph Tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, () => `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, () => `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, () => `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter Tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, () => `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, () => `<meta name="twitter:description" content="${route.description}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/s, () => `<meta name="twitter:url" content="${canonicalUrl}" />`);

  // Strip Homepage-specific hero poster preload from deep routes
  html = html.replace(
    /<link rel="preload" as="image" href="\/assets\/hero-video-poster\.webp".*?\/>\s*/s,
    ''
  );

  // Replace Homepage JSON-LD schema with page-specific schema
  if (route.schema) {
    const newSchemaTag = `<!-- Page-Specific JSON-LD Schema -->\n    <script type="application/ld+json">\n${JSON.stringify(route.schema, null, 2)}\n    </script>`;
    html = html.replace(
      /<!-- Schema\.org JSON-LD.*?<\/script>/s,
      () => newSchemaTag
    );
  }

  // Inject image preload if defined (for instant LCP discovery on deep pages like PDP)
  if (route.preloadImage) {
    const preloadTag = `    <link rel="preload" as="image" href="${route.preloadImage}" fetchpriority="high" type="image/webp" />\n`;
    html = html.replace('</head>', () => `${preloadTag}  </head>`);
  }

  // Inject Pre-rendered Semantic Shell into #root for zero-JS crawlers
  const fallbackShell = `
    <div id="seo-prerender-shell" style="padding: 40px 20px; max-width: 900px; margin: 0 auto; font-family: sans-serif;">
      <header>
        <p style="font-size: 13px; color: #748C48; text-transform: uppercase; font-weight: bold;">TIBRA NATURALS Official Store</p>
        <h1 style="font-size: 28px; color: #252E15; margin-top: 8px;">${route.h1}</h1>
      </header>
      <main style="margin-top: 20px; font-size: 15px; line-height: 1.6; color: #3E4A28;">
        <p>${route.content}</p>
        <p><a href="https://www.tibranaturals.com/products/pain-relief-oil/" style="color: #748C48; font-weight: bold;">View TIBRA NATURALS Pain Relief Oil (30 ML) &rarr;</a></p>
      </main>
    </div>
  `;

  html = html.replace('<div id="root"></div>', () => `<div id="root">${fallbackShell}</div>`);

  // Create target directory
  const cleanSubPath = route.path.replace(/^\/|\/$/g, '');
  const targetDir = path.join(distDir, cleanSubPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf-8');
  console.log(`  ✓ Prerendered: ${route.path} -> ${targetFile}`);
});

// Also inject Homepage Pre-rendered Semantic Fallback Shell into root dist/index.html
const rootHomepageFallbackShell = `
    <div id="seo-prerender-shell" style="padding: 40px 20px; max-width: 900px; margin: 0 auto; font-family: sans-serif;">
      <header>
        <p style="font-size: 13px; color: #748C48; text-transform: uppercase; font-weight: bold;">TIBRA NATURALS Official Herbal Store</p>
        <h1 style="font-size: 32px; color: #252E15; margin-top: 8px;">TIBRA NATURALS Herbal Wellness Oil – Move Freely. Live Better.</h1>
      </header>
      <main style="margin-top: 20px; font-size: 15px; line-height: 1.6; color: #3E4A28;">
        <p>Discover TIBRA NATURALS Pain Relief Oil — 100% natural herbal blend formulated with 16 time-tested botanical oils and active roots including Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for soothing joint comfort, muscle relaxation, and everyday mobility in Pakistan.</p>
        <p><a href="https://www.tibranaturals.com/products/pain-relief-oil/" style="color: #748C48; font-weight: bold;">Shop TIBRA NATURALS Pain Relief Oil (30 ML) &rarr;</a></p>
      </main>
    </div>
`;
const updatedRootHtml = baseHtml.replace('<div id="root"></div>', () => `<div id="root">${rootHomepageFallbackShell}</div>`);
fs.writeFileSync(indexHtmlPath, updatedRootHtml, 'utf-8');
console.log(`  ✓ Injected Semantic Prerender Shell into root: dist/index.html`);

// Generate Admin Portal Static Entry (dist/admin/index.html)
// This ensures https://www.tibranaturals.com/admin/ and /admin returns HTTP 200 OK directly on Vercel
const adminDir = path.join(distDir, 'admin');
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}
let adminHtml = baseHtml;
adminHtml = adminHtml.replace(/<title>.*?<\/title>/s, () => `<title>Admin Portal | TIBRA NATURALS</title>`);
adminHtml = adminHtml.replace(/<meta name="description" content=".*?" \/>/s, () => `<meta name="description" content="TIBRA NATURALS Store Administration and Order Management Portal" />`);
adminHtml = adminHtml.replace(/<link rel="canonical" href=".*?" \/>/s, () => `<link rel="canonical" href="https://www.tibranaturals.com/admin/" />`);
adminHtml = adminHtml.replace(/<meta name="robots" content=".*?" \/>/s, () => `<meta name="robots" content="noindex, nofollow" />`);
if (!adminHtml.includes('noindex')) {
  adminHtml = adminHtml.replace('</head>', () => `    <meta name="robots" content="noindex, nofollow" />\n  </head>`);
}
// Strip Homepage-specific hero poster preload from admin page
adminHtml = adminHtml.replace(/<link rel="preload" as="image" href="\/assets\/hero-video-poster\.webp".*?\/>\s*/s, '');
// Remove any homepage Schema.org script from admin page
adminHtml = adminHtml.replace(/<!-- Schema\.org JSON-LD.*?<\/script>/s, '');

fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'admin.html'), adminHtml, 'utf-8');
console.log(`  ✓ Generated Admin Portal entry: dist/admin/index.html & dist/admin.html (noindex, nofollow)`);

// Generate Transactional Pages (cart, checkout, order-success) with noindex, follow
const transactionalRoutes = [
  { path: '/cart/', title: 'Your Shopping Cart | TIBRA NATURALS Pakistan' },
  { path: '/checkout/', title: 'Secure Checkout | TIBRA NATURALS Pakistan' },
  { path: '/order-success/', title: 'Order Confirmed | TIBRA NATURALS Pakistan' }
];

transactionalRoutes.forEach(tr => {
  const trDir = path.join(distDir, tr.path.replace(/^\/|\/$/g, ''));
  if (!fs.existsSync(trDir)) {
    fs.mkdirSync(trDir, { recursive: true });
  }
  let trHtml = baseHtml;
  trHtml = trHtml.replace(/<title>.*?<\/title>/s, () => `<title>${tr.title}</title>`);
  trHtml = trHtml.replace(/<link rel="canonical" href=".*?" \/>/s, () => `<link rel="canonical" href="https://www.tibranaturals.com${tr.path}" />`);
  trHtml = trHtml.replace(/<meta name="robots" content=".*?" \/>/s, () => `<meta name="robots" content="noindex, follow" />`);
  if (!trHtml.includes('noindex')) {
    trHtml = trHtml.replace('</head>', () => `    <meta name="robots" content="noindex, follow" />\n  </head>`);
  }
  trHtml = trHtml.replace(/<link rel="preload" as="image" href="\/assets\/hero-video-poster\.webp".*?\/>\s*/s, '');
  trHtml = trHtml.replace(/<!-- Schema\.org JSON-LD.*?<\/script>/s, '');
  fs.writeFileSync(path.join(trDir, 'index.html'), trHtml, 'utf-8');
  console.log(`  ✓ Generated Transactional entry: dist${tr.path}index.html (noindex, follow)`);
});

console.log(`Static route prerendering completed successfully! (Total ${routes.length + 1} indexable pages + 4 app routes: 1 root + ${routes.length} deep routes + admin, cart, checkout, order-success)`);
