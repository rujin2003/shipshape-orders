import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import NewOrderForm from "@/components/orders/NewOrderForm";
import { useState } from "react";

const Orders = () => {
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState("");

  const generateRandomOrderId = () => {
    const randomNum = Math.floor(Math.random() * 10000);
    return `ORD${randomNum.toString().padStart(4, '0')}`;
  };

  const handleNewOrder = () => {
    setCurrentOrderId(generateRandomOrderId());
    setShowNewOrder(true);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {showNewOrder ? `New Order - ${currentOrderId}` : 'Orders'}
        </h2>
        <Button onClick={handleNewOrder}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      {showNewOrder ? (
        <NewOrderForm orderId={currentOrderId} />
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ORD001</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>$156.00</TableCell>
                  <TableCell>2024-03-20</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;