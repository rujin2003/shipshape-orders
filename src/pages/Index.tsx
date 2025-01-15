import SalesOverview from "@/components/dashboard/SalesOverview";
import RecentOrders from "@/components/dashboard/RecentOrders";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-6">
        <SalesOverview />
        <RecentOrders />
      </div>
    </div>
  );
};

export default Index;