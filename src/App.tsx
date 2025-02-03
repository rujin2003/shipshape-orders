import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import NewOrderForm from "./components/orders/NewOrderForm";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Shipments from "./pages/Shipments";
import NewShipment from "./pages/NewShipment";
import CreateShipment from "./pages/CreateShipment";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/verify-otp" element={!isAuthenticated ? <VerifyOTP /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/new" element={<NewOrderForm orderId={""} />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetails />} />
                  <Route path="/shipments" element={<Shipments />} />
                  <Route path="/shipments/new" element={<NewShipment />} />
                  <Route path="/shipments/create" element={<CreateShipment />} />
                </Routes>
              </main>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;