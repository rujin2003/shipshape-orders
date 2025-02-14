import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Trash } from "lucide-react";
import { Order } from "@/types/order";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsProps {
  order: Order;
  selectedItems: number[];
  onItemSelect: (itemId: number) => void;
  onCreateShipment: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrderDetails = ({
  order,
  selectedItems,
  onItemSelect,
  onCreateShipment,
  onDeleteOrder,
}: OrderDetailsProps) => {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    Object.fromEntries((order.items || []).map((item) => [item.id, item.quantity]))
  );
  const { toast } = useToast();

  const handleQuantityChange = (itemId: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value > 0 ? value : 1,
    }));
  };

  const handleDelete = () => {
    onDeleteOrder(order.id);
  };

  return (
    <Card className="m-2 bg-muted/50">
      <CardContent className="p-4">
        {/* Delivery Address with Delete Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p className="bg-gray-100 p-2 rounded-md">
              {order.address || "No delivery address provided"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>

        {/* Items Table */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Items</h3>
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-md">
                <thead className="bg-gray-200">
                  <tr>
                
                    <th className="px-4 py-2 border">Item Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Color</th>
                    <th className="px-4 py-2 border">Price ($)</th>
                    <th className="px-4 py-2 border">Total ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          min={1}
                          value={quantities[item.id]}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value))
                          }
                          className="w-16 px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex items-center space-x-2">
                          <span>{item.color}</span>
                          <div
                            className="w-5 h-5 rounded-full border"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 border">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 border">
                        ${(item.price * quantities[item.id]).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No items available for this order.</p>
          )}
        </div>

        {/* Create Shipment Button */}
        {(order.status === "pending" ||
          (order.status === "shipped but due" && order.dueItems?.length > 0)) && (
          <div className="flex justify-end mt-4">
            <Button onClick={() => onCreateShipment(order.id)}>
              <Package className="mr-2 h-4 w-4" />
              Create Shipment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
