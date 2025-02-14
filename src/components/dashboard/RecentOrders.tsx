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

  useEffect(() => {
    const fetchRecentOrders = async () => {
      
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

    fetchRecentOrders();
  }, [RecentOrders]);

  if (loading) return <p>Loading recent orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
