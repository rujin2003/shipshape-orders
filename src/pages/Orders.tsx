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
import { Plus, Search, ArrowLeft } from "lucide-react";
import NewOrderForm from "@/components/orders/NewOrderForm";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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

  const handleCancel = () => {
    setShowNewOrder(false);
    setCurrentOrderId("");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-red-500';
      case 'due':
        return 'text-red-500';
      case 'shipped':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {showNewOrder ? `New Order - ${currentOrderId}` : 'Orders'}
        </h2>
        {showNewOrder ? (
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        ) : (
          <Button onClick={handleNewOrder}>
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        )}
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
                <Accordion type="single" collapsible>
                  <AccordionItem value="order-1">
                    <TableRow>
                      <TableCell className="font-medium">
                        <AccordionTrigger className="hover:no-underline">
                          ORD001
                        </AccordionTrigger>
                      </TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell className={cn(getStatusColor("pending"))}>
                        Pending
                      </TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>$156.00</TableCell>
                      <TableCell>2024-03-20</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <AccordionContent>
                          <div className="px-4 py-2 bg-muted/50">
                            <h4 className="font-semibold mb-2">Order Items:</h4>
                            <ul className="space-y-2">
                              <li className="flex justify-between">
                                <span>Product A</span>
                                <span>$50.00 x 1</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Product B</span>
                                <span>$75.00 x 1</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Product C</span>
                                <span>$31.00 x 1</span>
                              </li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </TableCell>
                    </TableRow>
                  </AccordionItem>
                </Accordion>
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;