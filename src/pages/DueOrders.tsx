
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { toast } from "sonner";
import OrderViewModal from "@/components/orders/OrderViewModal";
import config from '@/config';

const DueOrders = () => {
  const navigate = useNavigate();
  const [viewOrderId, setViewOrderId] = React.useState<string | null>(null);

  const { data: dueOrders = [], isLoading } = useQuery({
    queryKey: ['dueOrders'],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/orders/due_order`, {
        headers: {
          Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to fetch due orders');
      return response.json();
    },
  });

  const handleCreateShipment = (order: any) => {
    navigate("/shipments/new", {
      state: {
        orderId: order.id,
        selectedItems: order.items.map((item: any) => item.id),
        orderDetails: order,
        isDueOrder: true
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Due Orders</h2>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dueOrders.length > 0 ? (
              dueOrders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">ORD{order.id}</TableCell>
                  <TableCell className="max-w-[120px] md:max-w-none truncate">{order.customer_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(order.shipment_due).toLocaleDateString()}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.items?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1 md:space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewOrderId(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCreateShipment(order)}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No due orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OrderViewModal
        order={dueOrders.find((o: any) => o.id === viewOrderId)}
        isOpen={!!viewOrderId}
        onClose={() => setViewOrderId(null)}
      />
    </div>
  );
};

export default DueOrders;
