import {
  CalendarRangeIcon,
  LayoutDashboardIcon,
  ScissorsIcon,
  SettingsIcon,
} from "lucide-react"

export const ADMIN_NAV_ITEMS = [
  {
    href: "/dashboard",
    tour: "tour-dashboard",
    label: "Dashboard",
    shortLabel: "Hoje",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/schedule",
    tour: "tour-schedule",
    label: "Agenda",
    shortLabel: "Agenda",
    icon: CalendarRangeIcon,
  },
  {
    href: "/services",
    tour: "tour-services",
    label: "Serviços",
    shortLabel: "Serviços",
    icon: ScissorsIcon,
  },
  {
    href: "/settings",
    tour: "tour-settings",
    label: "Configurações",
    shortLabel: "Ajustes",
    icon: SettingsIcon,
  },
] as const
