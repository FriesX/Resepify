import React from "react";
import { BookOpen, FileEdit, Archive, Eye } from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
    totalViews: number;
    totalCategories: number;
    activeViewers: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: "Resep Diterbitkan",
      value: stats.published,
      sub: "Dapat dibaca oleh viewer",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      title: "Draf Resep",
      value: stats.drafts,
      sub: "Belum tayang publik",
      icon: FileEdit,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      title: "Resep Diarsipkan",
      value: stats.archived,
      sub: "Disimpan aman (soft delete)",
      icon: Archive,
      color: "bg-slate-50 text-slate-700 border-slate-200",
      iconColor: "text-slate-500",
    },
    {
      title: "Total Pembaca Resep",
      value: stats.totalViews.toLocaleString("id-ID"),
      sub: "Akumulasi tayangan resep",
      icon: Eye,
      color: "bg-terracotta-50 text-terracotta-900 border-terracotta-200",
      iconColor: "text-terracotta-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-clay border shadow-xs transition-all hover:shadow-md ${c.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">{c.title}</span>
              <IconComponent className={`w-5 h-5 ${c.iconColor}`} aria-hidden="true" />
            </div>
            <div className="text-3xl font-serif font-bold tracking-tight mb-1">{c.value}</div>
            <p className="text-[11px] opacity-80">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
