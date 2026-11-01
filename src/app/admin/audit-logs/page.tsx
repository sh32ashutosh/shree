import React from "react";
import { prisma } from "@/lib/prisma";
import { History, ShieldCheck, Clock, User, Filter } from "lucide-react";

export default async function AdminAuditLogsPage() {
  const auditLogs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { actor: true },
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DED1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1916]">
              Immutable System Audit Logs ({auditLogs.length})
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Compliance Stream
            </span>
          </div>
          <p className="text-xs text-[#756B62] mt-1">
            Complete cryptographic audit trail recording every administrative login, inventory adjustment, order status transition, and catalog mutation.
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-[#E8DED1] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DED1] flex items-center justify-between">
          <span className="font-serif text-xs font-bold text-[#1F1916] uppercase tracking-wider">
            Administrative Audit Trail
          </span>
          <span className="text-xs text-[#756B62]">Retained in Database</span>
        </div>

        <div className="divide-y divide-[#E8DED1]">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#756B62]">
              No audit logs recorded yet. Administrative actions will automatically log here.
            </div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#FAF6F0]/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1916] uppercase tracking-wide">
                      {log.action}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#5E131D]/10 text-[#5E131D]">
                      {log.actorRole || "STAFF"}
                    </span>
                    {log.entityType && (
                      <span className="text-[10px] text-[#756B62] bg-[#FAF6F0] px-1.5 py-0.5 rounded border border-[#E8DED1]">
                        Entity: {log.entityType}
                      </span>
                    )}
                  </div>

                  <p className="text-[#756B62] font-mono text-[11px]">
                    By {log.actorName || log.actor?.email || "System"} • Actor ID: {log.actorId || "N/A"}
                  </p>

                  {log.details && (
                    <p className="text-[11px] text-[#1F1916] font-mono bg-[#FAF6F0] p-1.5 rounded max-w-2xl break-all">
                      {log.details}
                    </p>
                  )}
                </div>

                <div className="text-right text-[#756B62] shrink-0">
                  <span className="block font-semibold">
                    {new Date(log.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[10px]">
                    {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

