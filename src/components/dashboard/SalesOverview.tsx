
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingCart, Users, AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading";
import config from '@/config';

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

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        'Content-Type': 'application/json',
      };

      const [salesRes, customersRes, orderRes, pendingRes] = await Promise.all([
        fetch(`${config.apiUrl}/totalSales`, { method: 'GET', headers }),
        fetch(`${config.apiUrl}/customer/totalCount`, { method: 'GET', headers }),
        fetch(`${config.apiUrl}/order/totalordercount`, { method: 'GET', headers }),
        fetch(`${config.apiUrl}/orders/pending-count`, { method: 'GET', headers }),
      ]);

      if (!salesRes.ok || !customersRes.ok || !pendingRes.ok || !orderRes.ok) {
        throw new Error("Failed to fetch some statistics.");
      }

      const salesData = await salesRes.json();
      const customersData = await customersRes.json();
      const pendingData = await pendingRes.json();
      const orderData = await orderRes.json();

      setStats({
        totalSales: `$${(salesData.total_sales || 0).toLocaleString()}`,
        totalOrders: `${orderData.total_order_count}`,
        totalCustomers: `${customersData || 0}`,
        pendingShipments: `${pendingData.pending_order_count || 0}`,
      });

    } catch (err) {
      console.error("Error fetching sales data:", err);
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={fetchStats}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    );
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
