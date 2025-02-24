
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

interface ShipmentViewModalProps {
  shipment: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (shipmentId: number, e: React.MouseEvent) => void;
}

const ShipmentViewModal = ({
  shipment,
  isOpen,
  onClose,
  onDownload,
}: ShipmentViewModalProps) => {
  if (!shipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Shipment Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Shipment Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Shipment ID:</span> SHP{shipment.id}</p>
                <p><span className="font-medium">Order ID:</span> ORD{shipment.order_id}</p>
                <p><span className="font-medium">Ship Date:</span> {new Date(shipment.shipped_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Due Order:</span> {shipment.due_order_type ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Shipped Items</h3>
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
                  {shipment.items.map((item: any) => (
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
        </div>

        <DialogFooter>
          <Button onClick={(e) => onDownload(shipment.id, e)}>
            <Download className="mr-2 h-4 w-4" />
            Download Shipment Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentViewModal;
