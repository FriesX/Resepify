"use client";

import React from "react";
import { AuditEvent } from "@/types/audit";
import { X, Shield, Clock } from "lucide-react";

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditEvent[];
}

const actionBadges: Record<string, { label: string; class: string }> = {
  create: { label: "Buat Draf", class: "bg-blue-100 text-blue-800" },
  publish: { label: "Terbitkan", class: "bg-emerald-100 text-emerald-800" },
  update: { label: "Perbarui", class: "bg-amber-100 text-amber-800" },
  archive: { label: "Arsipkan", class: "bg-slate-200 text-slate-800" },
  restore: { label: "Pulihkan", class: "bg-teal-100 text-teal-800" },
  delete: { label: "Hapus Permanen", class: "bg-rose-100 text-rose-800" },
  backup: { label: "Ekspor Cadangan", class: "bg-purple-100 text-purple-800" },
  restore_backup: { label: "Pemulihan Cadangan", class: "bg-indigo-100 text-indigo-800" },
};

export function AuditLogModal({ isOpen, onClose, logs }: AuditLogModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-clay-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-terracotta-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-terracotta-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-terracotta-700" />
            </div>
            <div>
              <h3 id="audit-modal-title" className="font-serif text-xl font-bold text-slate-900">
                Log Audit Operasional Admin
              </h3>
              <p className="text-xs text-slate-500">
                Catatan riwayat perubahan resep dan status publikasi (OWASP Top 10)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {logs.length > 0 ? (
            logs.map((log) => {
              const badge = actionBadges[log.action] || {
                label: log.action,
                class: "bg-slate-100 text-slate-700",
              };
              const date = new Date(log.created_at).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div
                  key={log.id}
                  className="p-3.5 bg-cream-50/70 border border-terracotta-100 rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${badge.class}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {date}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900">
                    {log.entity_title || log.entity_id}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Oleh: <strong className="text-slate-700">{log.actor_name}</strong></span>
                    <span className="font-mono text-[10px] text-slate-400">ID: {log.entity_id}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada catatan log audit yang terekam.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
