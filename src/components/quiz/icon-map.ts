import {
  BarChart3,
  Calendar,
  Coins,
  Compass,
  Cpu,
  GraduationCap,
  Heart,
  Megaphone,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Registro de íconos disponibles para los pasos del reto (ver src/data/questions.ts). */
export const iconMap: Record<string, LucideIcon> = {
  chart: BarChart3,
  calendar: Calendar,
  coins: Coins,
  compass: Compass,
  cpu: Cpu,
  graduation: GraduationCap,
  heart: Heart,
  megaphone: Megaphone,
  refresh: RefreshCw,
  rocket: Rocket,
  shield: ShieldCheck,
  sparkles: Sparkles,
  target: Target,
  trending: TrendingUp,
  truck: Truck,
  users: Users,
  wrench: Wrench,
};

export const getIcon = (name: string): LucideIcon => iconMap[name] ?? Sparkles;
