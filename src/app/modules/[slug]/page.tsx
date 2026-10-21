import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calculator,
  Target,
  Ruler,
  ShoppingBag,
  Boxes,
  Factory,
  Truck,
  Building,
  CreditCard,
  Users,
  BarChart3,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { MODULES, ModuleInfo } from "@/lib/data";
import ModuleDetailClient from "./ModuleDetailClient";

export function generateStaticParams() {
  return MODULES.map((mod) => ({
    slug: mod.slug,
  }));
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  return <ModuleDetailClient module={mod} />;
}
