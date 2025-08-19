// src/app/page.tsx
"use client";

import React, { Suspense } from "react";
import DashboardContent from "@/app/components/DashboardContent";
import { DashboardSkeleton } from "@/app/components/SkeletonLoaders";

export default function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
