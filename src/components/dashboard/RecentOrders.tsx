
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import config from '@/config';

interface Order {
  id: number;
  customer_name: string;
  order_status: string;
  total_price: number;
  order_date: string;
}

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {
        "Authorization": `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${config.apiUrl}/orders/recentorders`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recent orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching recent orders:", err);
      setError("Could not load recent orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={fetchRecentOrders}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.order_status}</TableCell>
                  <TableCell>${order.total_price.toFixed(2)}</TableCell>
                  <TableCell>{order.order_date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 italic">
                  No recent orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
