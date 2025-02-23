
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Trash } from "lucide-react";
import { Order } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import config from '@/config';

interface DueItem {
  item_id: number;
  quantity: number;
  name?: string;
  price?: number;
  color?: string;
}

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
  const [dueItems, setDueItems] = useState<DueItem[]>([]);
  const { toast } = useToast();
  const AUTH_TOKEN = "04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK";

  useEffect(() => {
    const fetchDueItems = async () => {
      if (order.status === "shipped and due") {
        try {
          // Fetch due items
          const dueItemsResponse = await fetch(`${config.apiUrl}/due_items/${order.id}`, {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          });
          if (!dueItemsResponse.ok) throw new Error("Failed to fetch due items");
          const dueItemsData = await dueItemsResponse.json();

          // Fetch item details for each due item
          const itemDetailsPromises = dueItemsData.map(async (dueItem: DueItem) => {
            const itemResponse = await fetch(`${config.apiUrl}/items/${dueItem.item_id}`, {
              headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
              },
            });
            if (!itemResponse.ok) throw new Error(`Failed to fetch item ${dueItem.item_id}`);
            const itemData = await itemResponse.json();
            return {
              ...dueItem,
              name: itemData.name,
              price: itemData.price,
              color: itemData.color,
            };
          });

          const dueItemsWithDetails = await Promise.all(itemDetailsPromises);
          setDueItems(dueItemsWithDetails);
        } catch (error) {
          console.error("Error fetching due items:", error);
          toast({
            title: "Error",
            description: "Failed to load due items",
            variant: "destructive",
          });
        }
      }
    };

    fetchDueItems();
  }, [order.id, order.status]);

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

        {/* Order Items Table */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Order Items</h3>
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
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        />
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

        {/* Due Items Table */}
        {order.status === "shipped and due" && dueItems.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-red-600">Due Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-md">
                <thead className="bg-yellow-50">
                  <tr>
                    <th className="px-4 py-2 border">Item Name</th>
                    <th className="px-4 py-2 border">Quantity Due</th>
                    <th className="px-4 py-2 border">Color</th>
                    <th className="px-4 py-2 border">Price ($)</th>
                    <th className="px-4 py-2 border">Total ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {dueItems.map((item) => (
                    <tr key={item.item_id}>
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">{item.quantity}</td>
                      <td className="px-4 py-2 border">
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        />
                      </td>
                      <td className="px-4 py-2 border">${item?.price?.toFixed(2)}</td>
                      <td className="px-4 py-2 border">
                        ${((item?.price || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

