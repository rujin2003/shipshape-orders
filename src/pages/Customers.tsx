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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewCustomerForm from "@/components/customers/NewCustomerForm";
import EditCustomerForm from "@/components/customers/EditCustomerForm";

const Customers = () => {
  const navigate = useNavigate();
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<null | {
    name: string;
    email: string;
    phone: string;
    country: string;
    address: string;
  }>(null);

  const handleEdit = (customer: {
    name: string;
    email: string;
    phone: string;
    country: string;
    address: string;
  }) => {
    setEditingCustomer(customer);
    setShowNewCustomer(false);
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  const handleRowClick = (customerId: string) => {
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
        <NewCustomerForm />
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
              <TableRow 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick("1")}
              >
                <TableCell className="font-medium">John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>+1234567890</TableCell>
                <TableCell>United States</TableCell>
                <TableCell>5</TableCell>
                <TableCell>$543.00</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit({
                        name: "John Doe",
                        email: "john@example.com",
                        phone: "+1234567890",
                        country: "United States",
                        address: "123 Main St, City, State",
                      });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Customers;