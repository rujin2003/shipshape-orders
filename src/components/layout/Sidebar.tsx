
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingCart },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/shipments", label: "Shipments", icon: Package },
  ];

  return (
    <div className="h-screen min-w-[240px] border-r bg-white p-6 shadow-sm transition-all duration-200 ease-in-out lg:w-64">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Order Manager</h1>
      </div>
      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-current" : "text-muted-foreground")} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
