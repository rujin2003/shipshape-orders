
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import NewOrderForm from "./components/orders/NewOrderForm";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Shipments from "./pages/Shipments";
import NewShipment from "./pages/NewShipment";
import CreateShipment from "./pages/CreateShipment";
import DueOrders from "./pages/DueOrders";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useState, useEffect } from "react";
import { isLoggedIn } from "./lib/auth";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen overflow-hidden bg-gray-50">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    <main className={`flex-1 overflow-y-auto transition-all duration-200 ${sidebarOpen && !isMobile ? 'ml-[240px]' : 'ml-0'}`}>
                      <div className="p-3 md:p-6">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/orders/new" element={<NewOrderForm />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/customers/:id" element={<CustomerDetails />} />
                          <Route path="/shipments" element={<Shipments />} />
                          <Route path="/shipments/new" element={<NewShipment />} />
                          <Route path="/shipments/create" element={<CreateShipment />} />
                          <Route path="/due-orders" element={<DueOrders />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
