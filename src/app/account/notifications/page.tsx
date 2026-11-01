import React from "react";
import { getAuthenticatedCustomer } from "@/lib/data/customer-data";
import { Bell, Sparkles, CheckCircle2, Package } from "lucide-react";

export default async function AccountNotificationsPage() {
  const user = await getAuthenticatedCustomer();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#E8DED1] pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#5E131D]/10 text-[#5E131D] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1F1916]">
              Notifications & Order Dispatches
            </h1>
            <p className="text-xs text-[#756B62]">
              Real-time alerts regarding loom weaving progress, courier milestones, and royal events.
            </p>
          </div>
        </div>

        {user.notifications.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Bell className="w-12 h-12 text-[#756B62] mx-auto opacity-30" />
            <h3 className="font-serif text-base font-bold text-[#1F1916]">
              No New Notifications
            </h3>
            <p className="text-xs text-[#756B62] max-w-sm mx-auto">
              You are all caught up! When your sarees are packed or dispatched, status notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8DED1]">
            {user.notifications.map((notif) => (
              <div key={notif.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#5E131D] flex items-center justify-center shrink-0 mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#1F1916]">{notif.title}</h4>
                  <p className="text-xs text-[#756B62]">{notif.body}</p>
                  <span className="text-[10px] text-[#756B62] block">
                    {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

