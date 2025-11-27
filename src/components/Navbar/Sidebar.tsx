import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { sidebarItems } from "./items";
import { useAuthStore } from "@/store/authstore";
import { removeToken } from "@/utils/token";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const permissions = useAuthStore((state) => state.permissions);

  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    clearAuth();
    navigate("/auth");
  };
  // Filter menu according to read access
  const allowedMenu = sidebarItems.filter((item) => {
    const modulePermission = permissions?.[item.label];

    return modulePermission?.read === true;
  });

  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm fixed left-0 top-0 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 px-2">System</h1>

      <nav className="space-y-2 flex-1">
        {allowedMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 
            flex items-center justify-center gap-2 
            text-sm font-semibold hover:bg-gray-100 transition"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>


    </aside>
  );
}
