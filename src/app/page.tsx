"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestLanding } from "@/components/home/GuestLanding";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authenticated, automatically take user to recipes catalog
    if (!isLoading && isAuthenticated) {
      router.push("/recipes");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-terracotta-200 border-t-terracotta-800 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-terracotta-900 tracking-wider">
            Memuat Resepify...
          </span>
        </div>
      </div>
    );
  }

  // If user is guest, show guest landing
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1">
        <GuestLanding />
      </main>
      <Footer />
    </div>
  );
}
