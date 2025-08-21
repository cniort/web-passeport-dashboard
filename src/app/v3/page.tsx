// src/app/v3/page.tsx
"use client";

import React, { Suspense } from "react";
import DashboardV3Content from "@/app/components/DashboardV3Content";
import { DashboardSkeleton } from "@/app/components/SkeletonLoaders";

export default function PageV3() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardV3Content />
    </Suspense>
  );
}