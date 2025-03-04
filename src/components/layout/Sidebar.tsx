
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingCart },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/shipments", label: "Shipments", icon: Package },
    { href: "/due-orders", label: "Due Orders", icon: Clock },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="fixed top-2 left-2 z-50 md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed h-screen z-40 bg-white border-r shadow-sm transition-all duration-300 ease-in-out",
        isOpen ? "left-0" : "-left-full md:-left-[240px]",
        "w-[240px] md:w-[240px]"
      )}>
        <div className="p-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Order Manager</h1>
            <X className="h-5 w-5 cursor-pointer md:hidden" onClick={toggleSidebar} />
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
                  onClick={() => toggleSidebar()}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-current" : "text-muted-foreground")} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
