
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
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingCart },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/shipments", label: "Shipments", icon: Package },
    { href: "/due-orders", label: "Due Orders", icon: Clock },
  ];

  // Add class to prevent sidebar from being hidden when it should be visible
  const sidebarClass = isOpen 
    ? "left-0" 
    : "translate-x-[-100%] md:translate-x-[-240px]";

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
        "fixed h-screen z-40 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out",
        sidebarClass,
        "w-[240px]"
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="mb-6 flex flex-col items-center">
            <img 
              src="/lovable-uploads/d7abebe9-6cd0-4667-b353-03d16b777b82.png" 
              alt="Aaha Felt Logo" 
              className="h-16 mb-2" 
            />
            <h1 className="text-xl font-bold text-primary">Aaha Felt</h1>
            <p className="text-xs text-gray-500 mt-1">Order Management System</p>
          </div>
          
          <nav className="space-y-3 flex-grow">
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
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-current" : "text-muted-foreground")} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
            
            <div className="text-xs text-center text-gray-500 mt-4">
              <p>Aaha Felt</p>
              <p>Tokha 44600, Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
