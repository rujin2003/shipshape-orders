
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import NewOrderForm from "./components/orders/NewOrderForm";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Shipments from "./pages/Shipments";
import NewShipment from "./pages/NewShipment";
import CreateShipment from "./pages/CreateShipment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen overflow-hidden bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/new" element={<NewOrderForm />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/shipments" element={<Shipments />} />
              <Route path="/shipments/new" element={<NewShipment />} />
              <Route path="/shipments/create" element={<CreateShipment />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
