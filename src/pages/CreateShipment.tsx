import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data - replace with actual data fetching
const mockOrders = [
  {
    id: "ORD001",
    customerName: "John Doe",
    orderDate: "2024-03-20",
    status: "pending",
    items: [
      { id: 1, name: "Item 1", quantity: 2, price: 50 },
      { id: 2, name: "Item 2", quantity: 1, price: 30 },
    ],
    address: "123 Main St, City, State",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    orderDate: "2024-03-21",
    status: "shipped but due",
    items: [
      { id: 3, name: "Item 3", quantity: 3, price: 40 },
    ],
    dueItems: [
      { id: 4, name: "Item 4", quantity: 2, price: 25 },
    ],
    address: "456 Oak St, City, State",
  },
];

interface ShipmentItem {
  id: number;
  quantity: number;
  color?: string;
}

const CreateShipment = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const order = mockOrders.find((o) => o.id === selectedOrder);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
    setSelectedItems([]);
    setShipmentItems([]);
  };

  const handleItemSelect = (itemId: number, defaultQuantity: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setShipmentItems(shipmentItems.filter((item) => item.id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
      setShipmentItems([...shipmentItems, { id: itemId, quantity: defaultQuantity }]);
    }
  };

  const updateShipmentItemQuantity = (itemId: number, quantity: number) => {
    setShipmentItems(
      shipmentItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateShipmentItemColor = (itemId: number, color: string) => {
    setShipmentItems(
      shipmentItems.map((item) =>
        item.id === itemId ? { ...item, color } : item
      )
    );
  };

  const handleCreateShipment = () => {
    if (!selectedOrder) {
      toast({
        title: "Error",
        description: "Please select an order",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to ship",
        variant: "destructive",
      });
      return;
    }

    const itemsToShip = shipmentItems.map((shipItem) => {
      const orderItem = order?.items.find((item) => item.id === shipItem.id) ||
                       order?.dueItems?.find((item) => item.id === shipItem.id);
      return {
        ...orderItem,
        quantity: shipItem.quantity,
        color: shipItem.color,
      };
    });

    navigate("/shipments/new", {
      state: {
        orderId: selectedOrder,
        selectedItems,
        orderDetails: {
          ...order,
          items: itemsToShip,
        },
      },
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-[#F1F1F1]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1F2C]">Create Shipment</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="order-select" className="text-sm font-medium text-[#333333]">
            Select Order
          </label>
          <Select onValueChange={handleOrderSelect} value={selectedOrder || undefined}>
            <SelectTrigger id="order-select" className="bg-white">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {mockOrders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.id} - {order.customerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {order && (
          <Card className="border-[#D6BCFA] shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#1A1F2C] mb-2">Order Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#333333]">
                    <p>Customer: {order.customerName}</p>
                    <p>Address: {order.address}</p>
                    <p>Order Date: {order.orderDate}</p>
                    <p>Status: {order.status}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#1A1F2C] mb-2">Select Items</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#9b87f5] text-white">
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Available Quantity</TableHead>
                          <TableHead>Ship Quantity</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...(order.items || []), ...(order.dueItems || [])].map((item) => (
                          <TableRow key={item.id} className="hover:bg-[#F2FCE2]">
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleItemSelect(item.id, item.quantity)}
                                className="h-4 w-4 accent-[#9b87f5]"
                              />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {selectedItems.includes(item.id) && (
                                <Input
                                  type="number"
                                  min="1"
                                  max={item.quantity}
                                  value={
                                    shipmentItems.find((si) => si.id === item.id)
                                      ?.quantity || item.quantity
                                  }
                                  onChange={(e) =>
                                    updateShipmentItemQuantity(
                                      item.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-20 bg-white"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {selectedItems.includes(item.id) && (
                                <Input
                                  type="text"
                                  placeholder="Color"
                                  value={
                                    shipmentItems.find((si) => si.id === item.id)
                                      ?.color || ""
                                  }
                                  onChange={(e) =>
                                    updateShipmentItemColor(item.id, e.target.value)
                                  }
                                  className="w-32 bg-white"
                                />
                              )}
                            </TableCell>
                            <TableCell>${item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleCreateShipment}
                    className="bg-[#9b87f5] hover:bg-[#7a63f1] text-white"
                  >
                    Create Shipment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateShipment;
