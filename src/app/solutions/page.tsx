"use client";

import React from "react";
import { useHorizontalLayout } from "@/lib/horizontal";
import HorizontalSolutions from "@/components/horizontal/HorizontalSolutions";
import SolutionsJourney from "@/components/solutions/SolutionsJourney";

export default function SolutionsPage() {
  // Layout under review: ?layout=horizontal shows this page as a sideways journey (see lib/horizontal)
  const horizontal = useHorizontalLayout();
  if (horizontal) return <HorizontalSolutions />;

  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* The verticals and the modules as a journey of pages (#glass, #fabrication, #modules... turn to the right page) */}
      <SolutionsJourney />
    </div>
  );
}
