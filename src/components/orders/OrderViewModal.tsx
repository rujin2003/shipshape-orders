
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import config from "@/config";
import { LoadingSpinner } from "@/components/ui/loading";

interface OrderViewModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderViewModal = ({
  order,
  isOpen,
  onClose,
}: OrderViewModalProps) => {
  const { data: dueItems, isLoading: isDueItemsLoading } = useQuery({
    queryKey: ['dueItems', order?.id],
    queryFn: async () => {
      if (!order || order.status !== 'shipped and due') return null;
      
      const response = await fetch(`${config.apiUrl}/due_items/${order.id}`, {
        headers: {
          Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch due items');
      return response.json();
    },
    enabled: !!order && order.status === 'shipped and due',
  });

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
          <DialogDescription>
            View and manage order details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Order Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                <p><span className="font-medium">Customer:</span> {order.customerName}</p>
                <p><span className="font-medium">Date:</span> {order.orderDate}</p>
                <p><span className="font-medium">Status:</span> {order.status}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="bg-gray-100 p-3 rounded-md">{order.address}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.status === 'shipped and due' && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Due Items</h3>
              {isDueItemsLoading ? (
                <LoadingSpinner />
              ) : dueItems && dueItems.length > 0 ? (
                <div className="border rounded-md border-red-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dueItems.map((item: { item_id: number; quantity: number }) => (
                        <tr key={item.item_id}>
                          <td className="px-4 py-3">{item.item_id}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No due items found</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewModal;
