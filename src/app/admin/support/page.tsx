import React from "react";
import { prisma } from "@/lib/prisma";
import { HeadphonesIcon, MessageSquare, CheckCircle2, Clock, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminSupportPage() {
  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  async function createTicketAction(formData: FormData) {
    "use server";
    const subject = (formData.get("subject") as string)?.trim();
    const body = (formData.get("body") as string)?.trim();
    const priority = (formData.get("priority") as "LOW" | "NORMAL" | "HIGH" | "URGENT") || "NORMAL";

    if (!subject || !body) return;

    // Use admin user or first user
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) return;

    await prisma.supportTicket.create({
      data: {
        userId: firstUser.id,
        subject,
        body,
        priority,
        status: "OPEN",
      },
    });

    revalidatePath("/admin/support");
  }

  async function updateTicketStatusAction(formData: FormData) {
    "use server";
    const ticketId = formData.get("ticketId") as string;
    const status = formData.get("status") as "OPEN" | "IN_PROGRESS" | "WAITING_CUSTOMER" | "RESOLVED" | "CLOSED";

    if (ticketId && status) {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status, resolvedAt: status === "RESOLVED" ? new Date() : null },
      });
      revalidatePath("/admin/support");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Customer Concierge & Support Tickets ({tickets.length})
            </h1>
            <span className="text-[10px] bg-[#5E131D]/10 text-[#5E131D] font-bold px-2 py-0.5 rounded uppercase">
              Patron Care
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Resolve wedding registry queries, custom blouse stitching enquiries, and delivery assistance tickets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
            <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
              Support Queues
            </span>
            <span className="text-xs text-[#756B62]">{tickets.length} Active Tickets</span>
          </div>

          <div className="divide-y divide-[#E8DED1]">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#756B62]">
                No support tickets currently open. You can log an incoming concierge request on the right.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-5 space-y-3 hover:bg-[#FAF6F0]/20 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-sm text-[#1F1916]">
                      {t.subject}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.priority === "URGENT" || t.priority === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <p className="text-xs text-[#756B62]">{t.body}</p>

                  <div className="pt-2 border-t border-[#E8DED1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-[#756B62]">
                      Patron: {t.user.name || t.user.email} • {new Date(t.createdAt).toLocaleDateString("en-IN")}
                    </span>

                    <form action={updateTicketStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="ticketId" value={t.id} />
                      <select
                        name="status"
                        defaultValue={t.status}
                        className="px-2 py-1 text-xs bg-white border border-[#E8DED1] rounded focus:outline-none cursor-pointer"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="WAITING_CUSTOMER">WAITING CUSTOMER</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-[#5E131D] text-white rounded text-xs font-semibold"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Ticket Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs space-y-4 self-start">
          <h2 className="font-serif text-sm font-bold text-[#1F1916] uppercase tracking-wider border-b border-[#E8DED1] pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#5E131D]" />
            <span>Log Concierge Enquiry</span>
          </h2>

          <form action={createTicketAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Subject / Topic *
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="e.g. Zari customization enquiry for wedding order"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none focus:border-[#5E131D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Priority
              </label>
              <select
                name="priority"
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High (Bridal Order)</option>
                <option value="URGENT">Urgent (Express Dispatch Alert)</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Enquiry Details *
              </label>
              <textarea
                name="body"
                rows={3}
                required
                placeholder="Customer request details..."
                className="w-full px-3 py-2 text-xs border border-[#E8DED1] rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5E131D] hover:bg-[#4A0E17] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Log Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

