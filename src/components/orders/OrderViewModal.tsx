
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderViewModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateShipment: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
}

const OrderViewModal = ({
  order,
  isOpen,
  onClose,
  onCreateShipment,
  onEditOrder,
}: OrderViewModalProps) => {
  const navigate = useNavigate();

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
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

          {order.status === "shipped and due" && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Due Items</h3>
              <div className="border rounded-md border-red-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.dueItems?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onEditOrder(order.id)}>
            Edit Order
          </Button>
          {(order.status === "pending" || order.status === "shipped and due") && (
            <Button onClick={() => onCreateShipment(order.id)}>
              <Package className="mr-2 h-4 w-4" />
              Create Shipment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewModal;
