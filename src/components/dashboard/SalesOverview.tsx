import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { log } from "console";
import config from '@/config';
// Define interface for stats
interface StatsData {
  totalSales: string;
  totalOrders: string;
  totalCustomers: string;
  pendingShipments: string;
}

const SalesOverview = () => {
  const [stats, setStats] = useState<StatsData>({
    totalSales: "$0",
    totalOrders: "0",
    totalCustomers: "0",
    pendingShipments: "0",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all stats with Authorization header
  useEffect(() => {
    const fetchStats = async () => {
      try {
       
      
        const headers = {
          'Authorization': `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          'Content-Type': 'application/json',
        };

        const [salesRes, customersRes,orderRes, pendingRes] = await Promise.all([
          fetch(`${config.apiUrl}/totalSales`, { method: 'GET', headers }),
          fetch(`${config.apiUrl}/customer/totalCount`, { method: 'GET', headers }),
          fetch(`${config.apiUrl}/order/totalordercount`, { method: 'GET', headers }),
          fetch(`${config.apiUrl}/orders/pending-count`, { method: 'GET', headers }),
          
        ]);

        if (!salesRes.ok || !customersRes.ok || !pendingRes.ok) {
          throw new Error("Failed to fetch some statistics.");
        }

        const salesData = await salesRes.json();         // { "total_sales": 0 }
        const customersData = await customersRes.json(); // Plain number (e.g., 2)
        const pendingData = await pendingRes.json();     // { "pending_order_count": 1 }
        const orderData = await orderRes.json();         // { "total_order_count": 1 }

        setStats({
          totalSales: `$${(salesData.total_sales || 0).toLocaleString()}`,
          totalOrders: `${orderData.total_order_count}`,  // Dummy value for now
          totalCustomers: `${customersData || 0}`,
          pendingShipments: `${pendingData.pending_order_count || 0}`,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Failed to load statistics. Please try again.");
        setLoading(false);
      }
    };

    fetchStats();
  }, [stats]);

  // Stats configuration
  const statsConfig = [
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: DollarSign,
      description: "Total sales this month",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Total orders this month",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Active customers",
    },
    {
      title: "Pending Shipments",
      value: stats.pendingShipments,
      icon: Package,
      description: "Orders to be shipped",
    },
  ];

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SalesOverview;
