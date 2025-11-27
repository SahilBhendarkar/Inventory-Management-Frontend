import { LayoutDashboard, Users, Package, Repeat } from "lucide-react"
import { MODULE } from "@/enum/Module"

export const sidebarItems = [
  { label: MODULE.DASHBOARD, icon: LayoutDashboard, path: "/dashboard" },
  { label: MODULE.USER_MANAGEMENT, icon: Users, path: "/users" },
  { label: MODULE.PRODUCT_MANAGEMENT, icon: Package, path: "/products" },
  { label: MODULE.TRANSACTIONS, icon: Repeat, path: "/transactions" },
]
