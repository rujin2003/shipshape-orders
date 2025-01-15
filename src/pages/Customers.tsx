import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewCustomerForm from "@/components/customers/NewCustomerForm";
import EditCustomerForm from "@/components/customers/EditCustomerForm";
import { toast } from "sonner";

const Customers = () => {
  const navigate = useNavigate();
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customersData, setCustomersData] = useState([]);
  const AUTH_TOKEN = "04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch("http://localhost:8080/customers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!customersResponse.ok) throw new Error(`Error: ${customersResponse.status}`);
        const customers = await customersResponse.json();

        const updatedCustomers = await Promise.all(
          customers.map(async (customer) => {
            const orderRes = await fetch(`http://localhost:8080/orders/count/${customer.name}`, {
              headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
            });
            const orderData = await orderRes.json();

            const salesRes = await fetch(`http://localhost:8080/totalSales/${customer.name}`, {
              headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
            });
            const salesData = await salesRes.json();

            return {
              ...customer,
              order_count: orderData.order_count,
              total_sales: salesData.total_sales,
            };
          })
        );

        setCustomersData(updatedCustomers);
      } catch (error) {
        toast.error("Failed to fetch customer data");
      }
    };

    fetchData();
  }, []);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowNewCustomer(false);
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  const handleRowClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button onClick={() => setShowNewCustomer(!showNewCustomer)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      {showNewCustomer ? (
  <NewCustomerForm onCancel={() => setShowNewCustomer(false)} />
) : editingCustomer ? (
  <EditCustomerForm customer={editingCustomer} onCancel={handleCancelEdit} />
) : (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customersData.map((customer) => (
          <TableRow
            key={customer.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleRowClick(customer.id)}
          >
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.country}</TableCell>
            <TableCell>{customer.order_count}</TableCell>
            <TableCell>${customer.total_sales}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(customer);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}

    </div>
  );
};

export default Customers;
