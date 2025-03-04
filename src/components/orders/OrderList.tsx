
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isVerySmall = useMediaQuery("(max-width: 500px)");

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Table className={isVerySmall ? "mobile-stacked-table" : ""}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Order ID</TableHead>
            <TableHead className="w-[200px]">Customer</TableHead>
            {!isVerySmall && <TableHead className="w-[200px]">Date</TableHead>}
            {!isVerySmall && <TableHead className="w-[200px]">Status</TableHead>}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer" onClick={() => isVerySmall ? setViewOrderId(order.id) : onOrderClick(order.id)}>
              <TableCell className="font-medium" data-label="Order ID">{order.id}</TableCell>
              <TableCell data-label="Customer">{order.customerName}</TableCell>
              {!isVerySmall && <TableCell data-label="Date">{order.orderDate}</TableCell>}
              {!isVerySmall && <TableCell data-label="Status">{order.status}</TableCell>}
              <TableCell data-label="Actions">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mobile-btn-sm"
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
