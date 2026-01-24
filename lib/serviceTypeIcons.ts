import {
  Wrench,
  Car,
  PaintRoller,
  Gauge,
  ChartLine,
  Snowflake,
  LifeBuoy
} from "lucide-react";
import type { ComponentType } from "react";

export const serviceTypeIconMap: Record<
  string,
  ComponentType<{ size?: number }>
> = {
  "maintenance-service": Wrench,
  "general-mechanics": Car,
  "bodywork-paint": PaintRoller,
  "tires-wheels": LifeBuoy,
  "electronics-diagnostics": ChartLine,
  "tuning-performance": Gauge,
  "air-conditioning": Snowflake,
};

export function getServiceTypeIcon(
  slug?: string
): ComponentType<{ size?: number }> {
  if (!slug) return Wrench;
  return serviceTypeIconMap[slug] ?? Wrench;
}
