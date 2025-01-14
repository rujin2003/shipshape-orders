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
import { Search, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Item {
  id: number;
  name: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customerId: number;
  customerName: string;
  orderDate: string;
  shipmentDue: string;
  shipmentAddress: string;
  orderStatus: "pending" | "shipped" | "shipped but due";
  items: Item[];
  totalPrice: number;
  noOfItems: number;
}

// Updated mock data to match the new interface
const mockOrders: Order[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "John Doe",
    orderDate: "2024-03-20",
    shipmentDue: "2024-03-25",
    shipmentAddress: "123 Main St, City, State",
    orderStatus: "pending",
    items: [
      { id: 1, name: "Item 1", size: "M", color: "Blue", quantity: 2, price: 50 },
      { id: 2, name: "Item 2", size: "L", color: "Red", quantity: 1, price: 30 },
    ],
    totalPrice: 130,
    noOfItems: 3,
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Jane Smith",
    orderDate: "2024-03-21",
    shipmentDue: "2024-03-26",
    shipmentAddress: "456 Oak St, City, State",
    orderStatus: "shipped but due",
    items: [
      { id: 3, name: "Item 3", size: "S", color: "Green", quantity: 3, price: 40 },
    ],
    totalPrice: 120,
    noOfItems: 3,
  },
];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOrderClick = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    setSelectedItems([]);
  };

  const handleItemSelect = (itemId: number) => {
    setSelectedItems(
      selectedItems.includes(itemId)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId]
    );
  };

  const handleCreateShipment = (order: Order) => {
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to ship",
        variant: "destructive",
      });
      return;
    }
    navigate(`/shipments/new`, { 
      state: { 
        orderId: order.id, 
        selectedItems,
        orderDetails: order
      } 
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
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
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="w-[150px]">Customer</TableHead>
              <TableHead className="w-[120px]">Order Date</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Items</TableHead>
              <TableHead className="w-[100px]">Total</TableHead>
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
                  <TableCell>{order.shipmentDue}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>{order.noOfItems}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <Card className="m-2 bg-muted/50">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold mb-2">Delivery Address</h3>
                              <p>{order.shipmentAddress}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Items</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    {order.orderStatus === "pending" && (
                                      <TableHead className="w-[50px]"></TableHead>
                                    )}
                                    <TableHead>Item</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      {order.orderStatus === "pending" && (
                                        <TableCell>
                                          <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleItemSelect(item.id)}
                                            className="h-4 w-4"
                                          />
                                        </TableCell>
                                      )}
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.size || '-'}</TableCell>
                                      <TableCell>{item.color || '-'}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            {order.orderStatus === "pending" && (
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => handleCreateShipment(order)}
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