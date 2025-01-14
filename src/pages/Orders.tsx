import { useState } from "react";
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
import { Search, Package, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOrderClick = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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

  const handleCreateOrder = () => {
    const orderId = `ORD${Date.now()}`;
    navigate(`/orders/new`, { state: { orderId } });
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

  const handleCreateShipment = (orderId: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to ship",
        variant: "destructive",
      });
      return;
    }

    const order = mockOrders.find((order) => order.id === orderId);
    const itemsToShip = shipmentItems.map((shipItem) => {
      const orderItem = order?.items.find((item) => item.id === shipItem.id) ||
                       order?.dueItems?.find((item) => item.id === shipItem.id);
      return {
        ...orderItem,
        quantity: shipItem.quantity,
        color: shipItem.color,
      };
    });

    navigate(`/shipments/new`, {
      state: {
        orderId,
        selectedItems,
        orderDetails: {
          ...order,
          items: itemsToShip,
        },
      },
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button onClick={handleCreateOrder}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Order ID</TableHead>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead className="w-[200px]">Date</TableHead>
              <TableHead className="w-[200px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <>
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => handleOrderClick(order.id)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <Card className="m-2 bg-muted/50">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold mb-2">Delivery Address</h3>
                              <p>{order.address}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Items</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    {(order.status === "pending" || order.status === "shipped but due") && (
                                      <TableHead className="w-[50px]"></TableHead>
                                    )}
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    {(order.status === "pending" || order.status === "shipped but due") && (
                                      <>
                                        <TableHead>Ship Quantity</TableHead>
                                        <TableHead>Color</TableHead>
                                      </>
                                    )}
                                    <TableHead>Price</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      {order.status === "pending" && (
                                        <TableCell>
                                          <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleItemSelect(item.id, item.quantity)}
                                            className="h-4 w-4"
                                          />
                                        </TableCell>
                                      )}
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      {order.status === "pending" && selectedItems.includes(item.id) && (
                                        <>
                                          <TableCell>
                                            <Input
                                              type="number"
                                              min="1"
                                              max={item.quantity}
                                              value={shipmentItems.find(si => si.id === item.id)?.quantity || item.quantity}
                                              onChange={(e) => updateShipmentItemQuantity(item.id, parseInt(e.target.value))}
                                              className="w-20"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Input
                                              type="text"
                                              placeholder="Color"
                                              value={shipmentItems.find(si => si.id === item.id)?.color || ""}
                                              onChange={(e) => updateShipmentItemColor(item.id, e.target.value)}
                                              className="w-32"
                                            />
                                          </TableCell>
                                        </>
                                      )}
                                      <TableCell>${item.price}</TableCell>
                                    </TableRow>
                                  ))}
                                  {order.dueItems && order.dueItems.map((item) => (
                                    <TableRow key={item.id}>
                                      {order.status === "shipped but due" && (
                                        <TableCell>
                                          <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleItemSelect(item.id, item.quantity)}
                                            className="h-4 w-4"
                                          />
                                        </TableCell>
                                      )}
                                      <TableCell>{item.name} (Due)</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      {order.status === "shipped but due" && selectedItems.includes(item.id) && (
                                        <>
                                          <TableCell>
                                            <Input
                                              type="number"
                                              min="1"
                                              max={item.quantity}
                                              value={shipmentItems.find(si => si.id === item.id)?.quantity || item.quantity}
                                              onChange={(e) => updateShipmentItemQuantity(item.id, parseInt(e.target.value))}
                                              className="w-20"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Input
                                              type="text"
                                              placeholder="Color"
                                              value={shipmentItems.find(si => si.id === item.id)?.color || ""}
                                              onChange={(e) => updateShipmentItemColor(item.id, e.target.value)}
                                              className="w-32"
                                            />
                                          </TableCell>
                                        </>
                                      )}
                                      <TableCell>${item.price}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            {(order.status === "pending" || (order.status === "shipped but due" && order.dueItems?.length > 0)) && (
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => handleCreateShipment(order.id)}
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  Create Shipment
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;