"use client";

import React, { useState } from "react";
import { PaymentDetails, PaymentMethodType } from "@/types/checkout";
import { CreditCard, Smartphone, Building2, Wallet, ShieldAlert, Check } from "lucide-react";

interface PaymentMethodProps {
  paymentDetails: PaymentDetails;
  onChange: (details: PaymentDetails) => void;
  isValid: boolean;
}

const POPULAR_BANKS = [
  "HDFC Bank",
  "State Bank of India (SBI)",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

const POPULAR_WALLETS = [
  "PhonePe Wallet",
  "Paytm Payments Wallet",
  "Amazon Pay Balance",
  "MobiKwik",
];

export function PaymentMethodComponent({
  paymentDetails,
  onChange,
}: PaymentMethodProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethodType>(paymentDetails.method || "upi");

  const handleTabChange = (method: PaymentMethodType) => {
    setActiveTab(method);
    onChange({
      ...paymentDetails,
      method,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-xl font-bold text-[#1F1916]">
            Select Payment Method
          </h2>
          <span className="text-[10px] bg-[#5E131D] text-[#FAF6F0] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Demo Mode
          </span>
        </div>
        <p className="text-xs text-[#756B62] mt-0.5">
          Choose your preferred simulated gateway. No real financial transaction will occur.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8DED1] overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => handleTabChange("upi")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === "upi"
              ? "border-[#5E131D] text-[#5E131D] bg-[#FAF6F0]"
              : "border-transparent text-[#756B62] hover:text-[#1F1916]"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>UPI Instant (GPay / PhonePe)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("card")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === "card"
              ? "border-[#5E131D] text-[#5E131D] bg-[#FAF6F0]"
              : "border-transparent text-[#756B62] hover:text-[#1F1916]"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Credit / Debit Card</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("netbanking")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === "netbanking"
              ? "border-[#5E131D] text-[#5E131D] bg-[#FAF6F0]"
              : "border-transparent text-[#756B62] hover:text-[#1F1916]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Net Banking</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("wallet")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
            activeTab === "wallet"
              ? "border-[#5E131D] text-[#5E131D] bg-[#FAF6F0]"
              : "border-transparent text-[#756B62] hover:text-[#1F1916]"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallets</span>
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="p-5 border border-[#E8DED1] rounded-lg bg-white">
        {/* 1. UPI */}
        {activeTab === "upi" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Virtual Payment Address (VPA) / UPI ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentDetails.upiId || ""}
                  onChange={(e) =>
                    onChange({
                      ...paymentDetails,
                      method: "upi",
                      upiId: e.target.value,
                    })
                  }
                  placeholder="e.g. yourname@okhdfcbank or 9820012345@paytm"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
                />
              </div>
              <p className="text-[11px] text-[#756B62] mt-1">
                A simulated payment request will be sent to your UPI application.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-[#756B62]">
              <span className="font-semibold text-[#1F1916]">Supported:</span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                Google Pay
              </span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                PhonePe
              </span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                Paytm
              </span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                BHIM UPI
              </span>
            </div>
          </div>
        )}

        {/* 2. Cards */}
        {activeTab === "card" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardName || ""}
                  onChange={(e) =>
                    onChange({ ...paymentDetails, method: "card", cardName: e.target.value })
                  }
                  placeholder="Name as printed on card"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  16-Digit Card Number (Demo) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={paymentDetails.cardNumber || ""}
                  onChange={(e) =>
                    onChange({
                      ...paymentDetails,
                      method: "card",
                      cardNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Expiry Date (MM/YY) *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={paymentDetails.cardExpiry || ""}
                  onChange={(e) =>
                    onChange({ ...paymentDetails, method: "card", cardExpiry: e.target.value })
                  }
                  placeholder="12/28"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  CVV / CVC (3 Digits) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value=""
                  onChange={() => {}}
                  placeholder="•••"
                  className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-[#756B62]">
              <span className="font-semibold text-[#1F1916]">Accepted:</span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                RuPay
              </span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                Visa
              </span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                Mastercard
              </span>
              <span className="px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8DED1]">
                Amex
              </span>
            </div>
          </div>
        )}

        {/* 3. Net Banking */}
        {activeTab === "netbanking" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-[#1F1916] mb-1">
              Select Your Financial Institution *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_BANKS.map((bank) => {
                const isSelected = paymentDetails.bank === bank;
                return (
                  <button
                    key={bank}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...paymentDetails,
                        method: "netbanking",
                        bank,
                      })
                    }
                    className={`p-3 text-left rounded border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-[#5E131D] bg-[#5E131D]/5 font-bold text-[#5E131D]"
                        : "border-[#E8DED1] bg-white hover:border-[#C5A880]"
                    }`}
                  >
                    <span>{bank}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#5E131D]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Digital Wallets */}
        {activeTab === "wallet" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-[#1F1916] mb-1">
              Select Digital Wallet *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_WALLETS.map((wallet) => {
                const isSelected = paymentDetails.wallet === wallet;
                return (
                  <button
                    key={wallet}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...paymentDetails,
                        method: "wallet",
                        wallet,
                      })
                    }
                    className={`p-3 text-left rounded border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-[#5E131D] bg-[#5E131D]/5 font-bold text-[#5E131D]"
                        : "border-[#E8DED1] bg-white hover:border-[#C5A880]"
                    }`}
                  >
                    <span>{wallet}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#5E131D]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-2.5 p-3.5 bg-[#C5A880]/15 rounded-lg border border-[#E8DED1] text-xs text-[#756B62]">
        <ShieldAlert className="w-4 h-4 text-[#5E131D] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-[#1F1916]">
            Safe Local Demo Gateway Active
          </p>
          <p>
            No real credit card numbers, CVVs, or bank credentials are ever recorded or
            transmitted. This step simulates checkout authorization for this demo store.
          </p>
        </div>
      </div>
    </div>
  );
}
