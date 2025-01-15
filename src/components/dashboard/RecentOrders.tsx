import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    status: "Pending",
    total: "$156.00",
    date: "2024-03-20",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    status: "Shipped",
    total: "$245.50",
    date: "2024-03-19",
  },
  {
    id: "ORD003",
    customer: "Bob Johnson",
    status: "Delivered",
    total: "$89.99",
    date: "2024-03-18",
  },
  {
    id: "ORD004",
    customer: "Alice Brown",
    status: "Processing",
    total: "$432.00",
    date: "2024-03-17",
  },
];

const RecentOrders = () => {
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
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;