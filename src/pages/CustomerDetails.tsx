import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

const CustomerDetails = () => {
  const { id } = useParams();

  // For now, we'll use mock data. In a real application, you would fetch this data based on the ID
  const customer = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    country: "United States",
    address: "123 Main St, City, State",
  };

  const orders = [
    {
      id: "ORD001",
      date: "2024-03-20",
      status: "Pending",
      total: "$156.00",
    },
  ];

  const shipments = [
    {
      id: "SHP001",
      orderId: "ORD001",
      status: "In Transit",
      trackingNo: "TRK123456789",
      shipDate: "2024-03-20",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
        <Link to="/customers">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Customer Information */}
        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="font-medium">{customer.country}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{customer.address}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Orders</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Shipments */}
        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Shipments</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking No.</TableHead>
                <TableHead>Ship Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.orderId}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                  <TableCell>{shipment.trackingNo}</TableCell>
                  <TableCell>{shipment.shipDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;