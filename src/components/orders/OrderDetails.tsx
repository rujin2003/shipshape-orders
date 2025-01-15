import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Order } from "@/types/order";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
  order: Order;
  selectedItems: number[];
  onItemSelect: (itemId: number) => void;
  onCreateShipment: (orderId: string) => void;
}

const OrderDetails = ({
  order,
  selectedItems,
  onItemSelect,
  onCreateShipment,
}: OrderDetailsProps) => {
  return (
    <Card className="m-2 bg-muted/50">
      <CardContent className="p-4">
        <div>
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p>{order.address}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={onItemSelect}
              />
            ))}
            {order.dueItems?.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={onItemSelect}
              />
            ))}
          </div>
        </div>
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