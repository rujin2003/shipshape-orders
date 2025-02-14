import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import config from '@/config';

// Interfaces
interface Customer {
  id: number;
  name: string;
  number: string;
  email: string;
  country: string;
  address: string;
}

interface OrderItem {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_id: number;
  customer_name: string;
  order_date: string;
  shipment_due: string;
  shipment_address: string;
  order_status: "pending" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total_price: number;
  no_of_items: number;
}

const CreateShipment = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]); // Initialize as empty array
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch customers
  useEffect(() => {
    
    fetch(`${config.apiUrl}/customers`, {
      method: "GET",
      headers: {
        Authorization: "Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // Reset fetched state when customer or date changes
  useEffect(() => {
    setFetched(false);
  }, [selectedCustomer, selectedDate]);

  // Fetch orders based on customer and date
  const fetchOrders = () => {
    if (!selectedCustomer || !selectedDate) {
      toast({ title: "Error", description: "Please select a customer and date", variant: "destructive" });
      return;
    }
   

    setLoading(true);
    setFetched(true);
    fetch(`${config.apiUrl}/${selectedCustomer}/${selectedDate}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Ensure data is an array, even if API returns null or undefined
        setOrders(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length === 1) {
          // If only one order is found, set it as the selected order
          handleOrderSelect(data[0].id);
        } else {
          setSelectedOrder(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" });
        setOrders([]); // Set orders to an empty array in case of error
      })
      .finally(() => setLoading(false));
  };

  // Select order
  const handleOrderSelect = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setQuantities(
        Object.fromEntries(order.items.map((item) => [item.id, item.quantity]))
      );
      setSelectedItems([]);
    }
  };

  // Handle item selection
  const handleItemSelect = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value > 0 ? value : 1,
    }));
  };

  // Create shipment
  const handleCreateShipment = () => {
    if (!selectedOrder) {
      toast({ title: "Error", description: "Please select an order", variant: "destructive" });
      return;
    }

    if (selectedItems.length === 0) {
      toast({ title: "Error", description: "Please select at least one item", variant: "destructive" });
      return;
    }

    const itemsToShip = selectedOrder.items
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        ...item,
        quantity: quantities[item.id],
      }));

    navigate("/shipments/new", {
      state: {
        orderId: selectedOrder.id,
        selectedItems,
        orderDetails: { ...selectedOrder, items: itemsToShip },
      },
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Shipment</h2>

      {/* Customer and Date Selection */}
      <div className="flex space-x-4">
        <Select onValueChange={setSelectedCustomer} value={selectedCustomer || ""}>
          <SelectTrigger id="customer-select">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.name}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <Button onClick={fetchOrders} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Orders"}
        </Button>
      </div>

      {/* Display "Order not found" message only after fetching */}
      {fetched && !loading && orders.length === 0 && (
        <p className="text-gray-500 italic">Order not found</p>
      )}

      {/* Order Selection (only show if more than one order is found) */}
      {orders.length > 1 && (
        <Select onValueChange={handleOrderSelect} value={selectedOrder?.id || ""}>
          <SelectTrigger id="order-select">
            <SelectValue placeholder="Select an order" />
          </SelectTrigger>
          <SelectContent>
            {orders.map((order) => (
              <SelectItem key={order.id} value={order.id}>
                {order.customer_name} - {new Date(order.order_date).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Order Details */}
      {selectedOrder && (
        <Card className="m-2 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p className="bg-gray-100 p-2 rounded-md">{selectedOrder.shipment_address}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items</h3>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between p-2 border rounded-md mb-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                  />
                  <span>{item.name}</span>
                  <input
                    type="number"
                    value={quantities[item.id]}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="w-16 px-2 border rounded-md"
                  />
                  <span>${item.price.toFixed(2)}</span>
                  
                </div>
                
              ))}
            </div>
            
              <button
                type="button"
                onClick={handleCreateShipment}
                style={{
                  alignItems: "center",
                  backgroundImage: "linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb)",
                  border: "0",
                  borderRadius: "8px",
                  boxShadow: "rgba(151, 65, 252, 0.2) 0 15px 30px -5px",
                  boxSizing: "border-box",
                  color: "#ffffff",
                  display: "flex",
                  fontSize: "14px",
                  justifyContent: "center",
                  lineHeight: "1em",
                  maxWidth: "100%",
                  minWidth: "120px",
                  padding: "3px",
                  textDecoration: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                <span
                  style={{
                    backgroundColor: "rgb(5, 6, 45)",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    width: "100%",
                    height: "100%",
                    transition: "300ms",
                  }}
                >
                  Create Shipment
                </span>
              </button>

           
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateShipment;