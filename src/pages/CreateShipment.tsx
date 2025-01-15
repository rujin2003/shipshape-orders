import { useState, useEffect } from "react";
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


// Interfaces
interface OrderItem {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customer_id: number;
  customer_name: string;
  order_date: string;
  shipment_due: string;
  shipment_address: string;
  order_status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total_price: number;
  no_of_items: number;
}

interface ShipmentItem {
  id: number;
  quantity: number;
  color?: string;
}

const CreateShipment = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const order = orders.find((o) => o.id === selectedOrder);

  // Fetch orders from API
  useEffect(() => {
    fetch('http://localhost:8080/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleOrderSelect = (orderId: number) => {
    setSelectedOrder(orderId);
    setSelectedItems([]);
    setShipmentItems([]);
  };

  const handleItemSelect = (itemId: number, defaultQuantity: number, defaultColor: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setShipmentItems(shipmentItems.filter((item) => item.id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
      setShipmentItems([...shipmentItems, { id: itemId, quantity: defaultQuantity, color: defaultColor }]);
    }
  };

  const updateShipmentItemQuantity = (itemId: number, quantity: number) => {
    setShipmentItems(
      shipmentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
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
      toast({ title: "Error", description: "Please select an order", variant: "destructive" });
      return;
    }

    if (selectedItems.length === 0) {
      toast({ title: "Error", description: "Please select at least one item", variant: "destructive" });
      return;
    }

    const itemsToShip = shipmentItems.map((shipItem) => {
      const orderItem = order?.items.find((item) => item.id === shipItem.id);
      return { ...orderItem, quantity: shipItem.quantity, color: shipItem.color };
    });

    navigate("/shipments/new", {
      state: { orderId: selectedOrder, selectedItems, orderDetails: { ...order, items: itemsToShip } },
    });
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Shipment</h2>

      <Select onValueChange={(value) => handleOrderSelect(Number(value))} value={selectedOrder?.toString()}>
        <SelectTrigger id="order-select">
          <SelectValue placeholder="Select an order" />
        </SelectTrigger>
        <SelectContent>
          {orders.map((order) => (
            <SelectItem key={order.id} value={order.id.toString()}>
              {order.customer_name}  {new Date(order.order_date).toLocaleDateString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {order && (
        <Card>
          <CardContent>
            <br></br>
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <div className="ml-4 mb-4 space-y-1">
              <p className="italic ">Customer:</p><p className=""> {order.customer_name}</p>
              <p className="italic ">Address: {order.shipment_address}</p>
              <p className="italic ">Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
              <p className={`italic ${order.order_status === 'pending' ? 'text-red-500' : 'text-[#34495e]'}`}>
                Status: {order.order_status}
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Ship Quantity</TableHead>
                  <TableHead>Color</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id, item.quantity, item.color)}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={shipmentItems.find((si) => si.id === item.id)?.quantity || 1}
                        onChange={(e) => updateShipmentItemQuantity(item.id, parseInt(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={shipmentItems.find((si) => si.id === item.id)?.color || item.color}
                        onChange={(e) => updateShipmentItemColor(item.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleCreateShipment}>
                Create Shipment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateShipment;
