
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

interface DueItem {
  item_id: number;
  quantity: number;
  name?: string;
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
      const items = await response.json();

      // Fetch item details for each due item
      const itemsWithDetails = await Promise.all(
        items.map(async (item: DueItem) => {
          const itemResponse = await fetch(`${config.apiUrl}/items/${item.item_id}`, {
            headers: {
              Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
              "Content-Type": "application/json",
            },
          });
          if (!itemResponse.ok) return item;
          const itemDetails = await itemResponse.json();
          return { ...item, name: itemDetails.name };
        })
      );
      
      return itemsWithDetails;
    },
    enabled: !!order && order.status === 'shipped and due',
  });

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-responsive-content">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">Order Details</DialogTitle>
          <DialogDescription className="text-sm">
            View and manage order details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 modal-responsive-grid">
            <div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">Order Information</h3>
              <div className="space-y-1 md:space-y-2 text-sm">
                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                <p><span className="font-medium">Customer:</span> {order.customerName}</p>
                <p><span className="font-medium">Date:</span> {order.orderDate}</p>
                <p><span className="font-medium">Status:</span> {order.status}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">Delivery Address</h3>
              <p className="bg-gray-100 p-2 md:p-3 rounded-md text-sm break-words">{order.address}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Order Items</h3>
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 modal-responsive-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-2 md:px-4 py-2 md:py-3 truncate-mobile" data-label="Item">{item.name}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3" data-label="Qty">{item.quantity}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3" data-label="Color">
                        <span style={{ color: item.color }}>{item.color || 'N/A'}</span>
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3" data-label="Price">${item.price.toFixed(2)}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3" data-label="Total">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.status === 'shipped and due' && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600 text-sm md:text-base">Due Items</h3>
              {isDueItemsLoading ? (
                <LoadingSpinner />
              ) : dueItems && dueItems.length > 0 ? (
                <div className="border rounded-md border-red-200 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 modal-responsive-table">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dueItems.map((item: DueItem) => (
                        <tr key={item.item_id}>
                          <td className="px-2 md:px-4 py-2 md:py-3" data-label="Item">{item.name || `Item #${item.item_id}`}</td>
                          <td className="px-2 md:px-4 py-2 md:py-3" data-label="Quantity">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No due items found</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewModal;
