import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Clock, ChevronRight, Send } from 'lucide-react';
import { SeoHead } from '../SeoHead';
import BRAND_CONFIG from '../../config/brandConfig';
import { analyticsService } from '../../services/analyticsService';

export const ContactUsPage: React.FC = () => {
  const [inquiryType, setInquiryType] = useState('order_status');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tibranaturals.com/' },
      { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://www.tibranaturals.com/contact-us/' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      <SeoHead
        title="Contact Us | TIBRA NATURALS Customer Support Pakistan"
        description="Get in touch with TIBRA NATURALS Pakistan. Customer care, WhatsApp order reservations, delivery inquiries, and verified business address."
        canonicalPath="/contact-us/"
        schema={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-botanical-600 mb-6 font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-botanical-950 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-botanical-400" />
          <span className="text-botanical-950 font-bold" aria-current="page">Contact Us</span>
        </nav>

        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-[11px] font-semibold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Dedicated Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-botanical-950 tracking-tight leading-tight">
            We are Here to Assist You.
          </h1>
          <p className="text-xs sm:text-sm text-botanical-700 leading-relaxed">
            Have a question about <strong>TIBRA NATURALS Pain Relief Oil</strong>, current orders, or shipping across Pakistan? Connect with our dedicated support desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-botanical-950">Instant WhatsApp Support</h3>
              <p className="text-xs text-botanical-700 leading-relaxed">
                Fast order confirmation, order tracking updates, and dosage guidance via official WhatsApp.
              </p>
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsService.trackWhatsAppClick('contact_page_whatsapp')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors"
              >
                <span>Chat on WhatsApp ({BRAND_CONFIG.whatsappDisplay})</span>
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-botanical-950">Email Support</h3>
              <p className="text-xs text-botanical-700 leading-relaxed">
                Inquiries, feedback, and retailer distribution discussions.
              </p>
              <a
                href={`mailto:${BRAND_CONFIG.supportEmail}`}
                onClick={() => analyticsService.trackContactClick('email')}
                className="text-xs font-mono font-bold text-[#748C48] hover:underline block"
              >
                {BRAND_CONFIG.supportEmail}
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-[#748C48] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-botanical-950">Operating Hours</h3>
              <p className="text-xs text-botanical-700 leading-relaxed">
                Monday to Saturday: 9:00 AM – 8:00 PM (PKT)<br />
                Sunday: Automated WhatsApp Support Active
              </p>
            </div>
          </div>

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-luxury space-y-5">
            <h3 className="font-serif font-bold text-xl text-botanical-950">
              Send an Official Message
            </h3>
            <p className="text-xs text-botanical-700">
              Fill out the details below and a client advisor will respond within 2 to 4 business hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                analyticsService.trackContactSubmit({
                  form_id: 'contact_form',
                  form_name: 'contact_us',
                  inquiry_type: inquiryType,
                });
                alert('Thank you for reaching out! A TIBRA NATURALS representative will contact you shortly.');
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-botanical-900 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-[#748C48] outline-none bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-botanical-900 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-[#748C48] outline-none bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-botanical-900 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-[#748C48] outline-none bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-botanical-900 mb-1">Subject</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-[#748C48] outline-none bg-[#FAF8F5]"
                >
                  <option value="order_status">Order Status / Courier Tracking</option>
                  <option value="product_dosage">Product Dosage / Application Advice</option>
                  <option value="wholesale">Wholesale &amp; Retailer Inquiry</option>
                  <option value="general">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-botanical-900 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you today?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-[#748C48] outline-none bg-[#FAF8F5]"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#748C48] hover:bg-[#5F7339] text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
