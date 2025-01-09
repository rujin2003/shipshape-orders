import SalesOverview from "@/components/dashboard/SalesOverview";
import RecentOrders from "@/components/dashboard/RecentOrders";

const Index = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <SalesOverview />
        <RecentOrders />
      </div>
    </div>
  );
};

export default Index;