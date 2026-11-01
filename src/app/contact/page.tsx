"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Thank you. Our royal concierge team will contact you within 24 hours.");
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-[#5E131D] uppercase tracking-widest block">
            Royal Trousseau Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1916]">
            Get In Touch With Our Atelier
          </h1>
          <p className="text-xs text-[#756B62] leading-relaxed">
            Whether inquiring about bespoke bridal orders, Silk Mark verification, or worldwide shipping schedules, our dedicated specialists are here to serve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#756B62] tracking-wider block">
                    Direct Concierge Hotline
                  </span>
                  <a href="tel:+919820012345" className="font-bold text-sm text-[#1F1916] hover:text-[#5E131D]">
                    +91 98200 12345
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-[#756B62]">
                Available Monday to Saturday, 10:00 AM – 7:30 PM IST.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#756B62] tracking-wider block">
                    Official Correspondence
                  </span>
                  <a href="mailto:concierge@saubhagyasarees.com" className="font-bold text-sm text-[#1F1916] hover:text-[#5E131D]">
                    concierge@saubhagyasarees.com
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-[#756B62]">
                Inquiries answered within 4 business hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#756B62] tracking-wider block">
                    Heritage Flagship Atelier
                  </span>
                  <p className="font-bold text-xs text-[#1F1916]">
                    Saubhagya Sarees Atelier
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-[#756B62]">
                Lane 7, Koregaon Park, Pune, Maharashtra 411001, India.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E8DED1] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#1F1916] border-b border-[#E8DED1] pb-3">
              Send an Atelier Inquiry
            </h2>

            {sent ? (
              <div className="p-8 text-center space-y-3 bg-[#FAF6F0] rounded-2xl border border-[#E8DED1]">
                <Sparkles className="w-10 h-10 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#1F1916]">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs text-[#756B62]">
                  We have received your note. A member of our bridal trousseau guild will connect with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                      Contact Phone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                      Inquiry Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
                    >
                      <option value="">Select subject...</option>
                      <option value="Bridal Trousseau Consultation">Bridal Trousseau Consultation</option>
                      <option value="Silk Mark Certificate Verification">Silk Mark Certificate Verification</option>
                      <option value="International Insured Shipping">International Insured Shipping</option>
                      <option value="Custom Border & Blouse Stitching">Custom Border & Blouse Stitching</option>
                      <option value="Other Atelier Assistance">Other Atelier Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                    Your Message / Wedding Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share any preferred colors, dates, or specific saree designs..."
                    className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Concierge Note</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

