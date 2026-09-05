import {
  CalendarRangeIcon,
  LayoutDashboardIcon,
  ScissorsIcon,
  SettingsIcon,
} from "lucide-react"

export const ADMIN_NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Hoje",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/schedule",
    label: "Agenda",
    shortLabel: "Agenda",
    icon: CalendarRangeIcon,
  },
  {
    href: "/services",
    label: "Serviços",
    shortLabel: "Serviços",
    icon: ScissorsIcon,
  },
  {
    href: "/settings",
    label: "Configurações",
    shortLabel: "Ajustes",
    icon: SettingsIcon,
  },
] as const
