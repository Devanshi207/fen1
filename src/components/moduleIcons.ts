import { CheckSquare, Layers, Calculator, Scan, Compass, Building2, ShoppingCart, Boxes, Factory, Wrench, ShieldCheck, Truck, CreditCard, Users, UserCheck, Settings, BarChart3 } from "lucide-react";

export const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "task-management": CheckSquare,
  crm: Layers,
  estimation: Calculator,
  survey: Scan,
  design: Compass,
  "project-management": Building2,
  "purchase-management": ShoppingCart,
  store: Boxes,
  production: Factory,
  maintenance: Wrench,
  "quality-control": ShieldCheck,
  logistics: Truck,
  account: CreditCard,
  hr: Users,
  ess: UserCheck,
  "admin-settings": Settings,
  "reports-analytics": BarChart3,
};
