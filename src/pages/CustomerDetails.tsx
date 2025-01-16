import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AUTH_TOKEN = "04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerResponse = await fetch(`http://localhost:8080/customers/${id}`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });
        if (!customerResponse.ok) throw new Error("Failed to fetch customer details");
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        const ordersResponse = await fetch(`http://localhost:8080/orders/history/${customerData.name}`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });
        const ordersData = ordersResponse.ok ? await ordersResponse.json() : [];
        setOrders(ordersData || []);

        const shipmentsResponse = await fetch(`http://localhost:8080/shipments/${customerData.name}`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });
        const shipmentsData = shipmentsResponse.ok ? await shipmentsResponse.json() : [];
        setShipments(shipmentsData || []);

      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  // DELETE request for customer
  const handleDeleteCustomer = async () => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const deleteResponse = await fetch(`http://localhost:8080/customers/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!deleteResponse.ok) throw new Error("Failed to delete customer");

        toast.success("Customer deleted successfully");
        navigate("/customers");  // Redirect back to the Customers list
      } catch (error) {
        toast.error("Failed to delete customer");
      }
    }
  };

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
        {customer && (
          <div className="rounded-lg border p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
            {/* Delete Icon */}
            <button
              onClick={handleDeleteCustomer}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
              title="Delete Customer"
            >
              <Trash2 className="h-6 w-6" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{customer.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{customer.country || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{customer.address || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

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
                  <TableCell>{order.order_date || "N/A"}</TableCell>
                  <TableCell>{order.order_status || "N/A"}</TableCell>
                  <TableCell>${order.total_price || "0.00"}</TableCell>
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
                  <TableCell>{shipment.orderId || "N/A"}</TableCell>
                  <TableCell>{shipment.status || "N/A"}</TableCell>
                  <TableCell>{shipment.trackingNo || "N/A"}</TableCell>
                  <TableCell>{shipment.shipDate || "N/A"}</TableCell>
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
