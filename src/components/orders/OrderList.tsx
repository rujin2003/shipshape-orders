
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Order } from "@/types/order";
import { useState } from "react";
import OrderViewModal from "./OrderViewModal";

interface OrderListProps {
  orders: Order[];
  expandedOrder: string | null;
  onOrderClick: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
  selectedItems: number[];
  onItemSelect: (itemId: number) => void;
  onDeleteOrder: (orderId: string) => void;
  searchQuery?: string;
}

const OrderList = ({
  orders,
  expandedOrder,
  onOrderClick,
  onEditOrder,
  selectedItems,
  onItemSelect,
  onDeleteOrder,
  searchQuery = "",
}: OrderListProps) => {
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Order ID</TableHead>
            <TableHead className="w-[200px]">Customer</TableHead>
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead className="w-[200px]">Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer">
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewOrderId(order.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OrderViewModal
        order={orders.find((o) => o.id === viewOrderId)}
        isOpen={!!viewOrderId}
        onClose={() => setViewOrderId(null)}
      />
    </>
  );
};

export default OrderList;
