
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingCart, Users, AlertCircle, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading";
import config from '@/config';

interface StatsData {
  totalSales: string;
  totalOrders: string;
  totalCustomers: string;
  pendingShipments: string;
}

interface SalesData {
  month: number;
  total_sales: number;
  year: number;
}

interface OrdersData {
  month: number;
  total_orders: number;
  year: number;
}

const SalesOverview = () => {
  const [stats, setStats] = useState<StatsData>({
    totalSales: "$0",
    totalOrders: "0",
    totalCustomers: "0",
    pendingShipments: "0",
  });

  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1); // JavaScript months are 0-indexed
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

      // Format month as two digits
      const formattedMonth = month.toString().padStart(2, '0');

      const [salesRes, orderRes, customersRes, pendingRes] = await Promise.all([
        fetch(`${config.apiUrl}/api/sales/${year}/${formattedMonth}`, { method: 'GET', headers }),
        fetch(`${config.apiUrl}/api/orders/${year}/${formattedMonth}`, { method: 'GET', headers }),
        fetch(`${config.apiUrl}/customer/totalCount`, { method: 'GET', headers }),
        fetch(`${config.apiUrl}/orders/pending-count`, { method: 'GET', headers }),
      ]);

      if (!salesRes.ok || !customersRes.ok || !pendingRes.ok || !orderRes.ok) {
        throw new Error("Failed to fetch some statistics.");
      }

      const salesData: SalesData = await salesRes.json();
      const ordersData: OrdersData = await orderRes.json();
      const customersData = await customersRes.json();
      const pendingData = await pendingRes.json();

      setStats({
        totalSales: `$${(salesData.total_sales || 0).toLocaleString()}`,
        totalOrders: `${ordersData.total_orders || 0}`,
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
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const resetToCurrentMonth = () => {
    const now = new Date();
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  // Helper function to get month name
  const getMonthName = (monthNumber: number) => {
    const date = new Date(2000, monthNumber - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const statsConfig = [
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: DollarSign,
      description: `Sales for ${getMonthName(month)} ${year}`,
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: `Orders for ${getMonthName(month)} ${year}`,
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
      <Card className="col-span-4 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <LoadingSpinner />
            <p className="text-sm text-muted-foreground mt-4">Loading statistics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-4">
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="ml-4 hover:bg-destructive/10"
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {getMonthName(month)} {year}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToCurrentMonth}
        >
          Current Month
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SalesOverview;
