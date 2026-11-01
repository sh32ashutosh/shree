"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema, ShippingAddressFormData } from "@/lib/validation";
import { Address } from "@/types/checkout";
import { useOrderStore } from "@/stores/order-store";
import { Plus, CheckCircle2, ShieldCheck } from "lucide-react";

interface ShippingFormProps {
  onAddressSelected: (address: Address) => void;
  selectedAddress: Address | null;
}

export function ShippingForm({ onAddressSelected, selectedAddress }: ShippingFormProps) {
  const { addresses, addAddress } = useOrderStore();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const onNewAddressSubmit = (data: ShippingAddressFormData) => {
    const created = addAddress(data);
    onAddressSelected(created);
    setShowNewAddressForm(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1F1916]">
            Shipping Destination
          </h2>
          <p className="text-xs text-[#756B62]">
            Select an existing verified address or provide a new delivery location.
          </p>
        </div>

        {!showNewAddressForm && (
          <button
            type="button"
            onClick={() => setShowNewAddressForm(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5E131D] hover:text-[#4A0E17] uppercase tracking-wider py-1.5 px-3 border border-[#5E131D] rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* Saved Demo Addresses Selector */}
      {!showNewAddressForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => onAddressSelected(addr)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                  isSelected
                    ? "border-[#5E131D] bg-[#FDFBF7] shadow-sm"
                    : "border-[#E8DED1] bg-white hover:border-[#C5A880]"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1F1916]">{addr.fullName}</span>
                    <span className="text-[10px] bg-[#C5A880]/20 text-[#5E131D] px-1.5 py-0.5 rounded font-semibold uppercase">
                      Demo Sample
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#5E131D] shrink-0" />
                  )}
                </div>

                <div className="text-xs text-[#756B62] space-y-1">
                  <p>{addr.addressLine}</p>
                  <p>
                    {addr.city}, {addr.state} — <strong>{addr.pinCode}</strong>
                  </p>
                  <p className="pt-1">
                    Phone: <span className="text-[#1F1916]">{addr.phone}</span>
                  </p>
                  <p>Email: {addr.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Address Input Form */}
      {showNewAddressForm && (
        <form
          onSubmit={handleSubmit(onNewAddressSubmit)}
          className="p-5 border border-[#E8DED1] rounded-lg bg-white space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center border-b border-[#E8DED1] pb-3">
            <h3 className="font-serif text-base font-bold text-[#1F1916]">
              Enter New Delivery Address
            </h3>
            <button
              type="button"
              onClick={() => setShowNewAddressForm(false)}
              className="text-xs text-[#756B62] hover:text-[#1F1916] underline"
            >
              Cancel & Use Saved
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="e.g. Radhika Sharma"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="e.g. radhika@example.com"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                10-Digit Mobile Number *
              </label>
              <input
                type="tel"
                maxLength={10}
                {...register("phone")}
                placeholder="e.g. 9820012345"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.phone && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Indian PIN Code (6 Digits) *
              </label>
              <input
                type="text"
                maxLength={6}
                {...register("pinCode")}
                placeholder="e.g. 560001"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.pinCode && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.pinCode.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Address (House/Flat, Street, Landmark) *
              </label>
              <input
                type="text"
                {...register("addressLine")}
                placeholder="e.g. Bungalow 12, Heritage Enclave, Palace Road"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.addressLine && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.addressLine.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                City / Town *
              </label>
              <input
                type="text"
                {...register("city")}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.city && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                State *
              </label>
              <input
                type="text"
                {...register("state")}
                placeholder="e.g. Karnataka"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded focus:outline-none focus:border-[#5E131D]"
              />
              {errors.state && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowNewAddressForm(false)}
              className="px-4 py-2 text-xs text-[#756B62] hover:text-[#1F1916] border border-[#E8DED1] rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded"
            >
              Save & Use This Address
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-2 p-3 bg-[#C5A880]/15 rounded border border-[#E8DED1] text-xs text-[#756B62]">
        <ShieldCheck className="w-4 h-4 text-[#5E131D] shrink-0" />
        <span>
          Addresses are stored locally on your device for demo purposes and never transmitted to external servers.
        </span>
      </div>
    </div>
  );
}
