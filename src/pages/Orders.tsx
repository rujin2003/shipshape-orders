import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import OrderList from "@/components/orders/OrderList";
import OrderDetails from "@/components/orders/OrderDetails";
import EditOrderModal from "@/components/orders/EditOrderModal";
import { Order, OrderItem } from "@/types/order";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch orders from API
  useEffect(() => {
    fetch("http://localhost:8080/orders", {
      method: "GET",
      headers: {
        "Authorization": `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const mappedOrders: Order[] = data.map((order: any) => ({
          id: `ORD${order.id.toString().padStart(3, '0')}`,  // Convert numeric ID to string
          customerName: order.customer_name,
          orderDate: new Date(order.order_date).toLocaleDateString(),
          status: order.order_status,
          items: order.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          address: order.shipment_address,
        }));
        setOrders(mappedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleOrderClick = (orderId: string) => {
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

  const handleCreateOrder = () => {
    const orderId = `ORD${Date.now()}`;
    navigate(`/orders/new`, { state: { orderId } });
  };

  const handleEditOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setEditedItems([...order.items]);
      setEditingOrder(orderId);
    }
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Order Updated",
      description: "The order has been successfully updated.",
    });
    setEditingOrder(null);
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

    const order = orders.find((order) => order.id === orderId);
    if (!order) return;

    navigate(`/shipments/new`, {
      state: {
        orderId,
        selectedItems,
        orderDetails: order,
      },
    });
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        <OrderList
          orders={orders}
          expandedOrder={expandedOrder}
          onOrderClick={handleOrderClick}
          onEditOrder={handleEditOrder}
        />
        {expandedOrder && (
          <OrderDetails
            order={orders.find((o) => o.id === expandedOrder)!}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onCreateShipment={handleCreateShipment}
          />
        )}
      </div>

      <EditOrderModal
        isOpen={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        order={orders.find((o) => o.id === editingOrder) || null}
        editedItems={editedItems}
        onUpdateItem={handleUpdateItem}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Orders;
