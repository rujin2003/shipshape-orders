import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Order } from "@/types/order";

interface OrderListProps {
  orders: Order[];
  expandedOrder: string | null;
  onOrderClick: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
}

const OrderList = ({ orders, expandedOrder, onOrderClick, onEditOrder }: OrderListProps) => {
  return (
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
        {orders.map((order) => (
          <TableRow
            key={order.id}
            className="cursor-pointer"
            onClick={() => onOrderClick(order.id)}
          >
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
                  onEditOrder(order.id);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderList;