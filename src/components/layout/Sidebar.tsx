import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  ShoppingCart,
  Users,
  Truck,
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { logout, userEmail } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Package className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link to="/orders">
              <Button
                variant={isActive("/orders") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link to="/customers">
              <Button
                variant={isActive("/customers") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
            </Link>
            <Link to="/shipments">
              <Button
                variant={isActive("/shipments") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Truck className="mr-2 h-4 w-4" />
                Shipments
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="px-4 py-2 text-sm text-gray-500">{userEmail}</div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;