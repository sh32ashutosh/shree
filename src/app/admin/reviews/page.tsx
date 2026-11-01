import React from "react";
import { prisma } from "@/lib/prisma";
import { moderateReview } from "@/lib/actions/admin";
import { Star, CheckCircle2, XCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { title: true, sku: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  async function handleModeration(reviewId: string, status: "APPROVED" | "REJECTED" | "FLAGGED") {
    "use server";
    await moderateReview(reviewId, status);
    revalidatePath("/admin/reviews");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Product Reviews & Patron Testimonials ({reviews.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Verified Purchase Moderation
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Moderate ratings, approve legitimate bridal reviews, and maintain authentic patron feedback across the boutique catalog.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
          <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
            Client Review Submissions
          </span>
          <span className="text-xs text-[#756B62]">{reviews.length} Total</span>
        </div>

        <div className="divide-y divide-[#E8DED1]">
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#756B62]">
              No product reviews submitted yet. When customers review sarees, they will appear here for moderation.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-6 space-y-3 hover:bg-[#FAF6F0]/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#1F1916]">
                      {rev.product.title}
                    </span>
                    <span className="text-[#756B62] ml-2 font-mono">({rev.product.sku})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rev.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : rev.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rev.status}
                    </span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-[#1F1916] ml-1.5">{rev.rating} / 5</span>
                </div>

                {rev.title && <h4 className="font-bold text-xs text-[#1F1916]">{rev.title}</h4>}
                {rev.body && <p className="text-xs text-[#756B62]">{rev.body}</p>}

                <div className="pt-2 border-t border-[#E8DED1]/60 flex items-center justify-between text-xs">
                  <span className="text-[#756B62]">
                    By {rev.user.name || rev.user.email} on {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                  </span>

                  <div className="flex items-center gap-2">
                    <form action={handleModeration.bind(null, rev.id, "APPROVED")}>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={handleModeration.bind(null, rev.id, "REJECTED")}>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

