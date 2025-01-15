import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown, ChevronRight } from "lucide-react";
import { Order } from "@/types/order";
import OrderDetails from "./OrderDetails";

interface OrderListProps {
  orders: Order[];
  expandedOrder: string | null;
  onOrderClick: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
  selectedItems: number[]; // Added this prop
  onItemSelect: (itemId: number) => void; // Added this prop
  onCreateShipment: (orderId: string) => void; 
  onDeleteOrder: (orderId: string) => void; 
}

const OrderList = ({
  orders,
  expandedOrder,
  onOrderClick,
  onEditOrder,
  selectedItems,
  onItemSelect,
  onCreateShipment,
  onDeleteOrder,
}: OrderListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead> {/* Expand Icon */}
          <TableHead className="w-[200px]">Order ID</TableHead>
          <TableHead className="w-[200px]">Customer</TableHead>
          <TableHead className="w-[200px]">Date</TableHead>
          <TableHead className="w-[200px]">Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <>
            {/* Main Order Row */}
            <TableRow
              key={order.id}
              className="cursor-pointer"
              onClick={() => onOrderClick(order.id)}
            >
              <TableCell>
                {expandedOrder === order.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </TableCell>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents expanding when clicking the edit button
                    onEditOrder(order.id);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>

            {/* Expanded Order Details */}
            {expandedOrder === order.id && (
              <TableRow>
                <TableCell colSpan={6}>
                  <OrderDetails

                    order={order}
                    selectedItems={selectedItems}
                    onItemSelect={onItemSelect}
                    onCreateShipment={onCreateShipment}
                    onDeleteOrder={onDeleteOrder}
                  />
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderList;
