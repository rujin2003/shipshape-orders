import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import OrderList from "@/components/orders/OrderList";
import OrderDetails from "@/components/orders/OrderDetails";
import EditOrderModal from "@/components/orders/EditOrderModal";
import { Order, OrderItem } from "@/types/order";

// Mock data - replace with actual data fetching
const mockOrders: Order[] = [
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
    items: [{ id: 3, name: "Item 3", quantity: 3, price: 40 }],
    dueItems: [{ id: 4, name: "Item 4", quantity: 2, price: 25 }],
    address: "456 Oak St, City, State",
  },
];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<OrderItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    const order = mockOrders.find((o) => o.id === orderId);
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

    const order = mockOrders.find((order) => order.id === orderId);
    if (!order) return;

    navigate(`/shipments/new`, {
      state: {
        orderId,
        selectedItems,
        orderDetails: order,
      },
    });
  };

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
          orders={mockOrders}
          expandedOrder={expandedOrder}
          onOrderClick={handleOrderClick}
          onEditOrder={handleEditOrder}
        />
        {expandedOrder && (
          <OrderDetails
            order={mockOrders.find((o) => o.id === expandedOrder)!}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onCreateShipment={handleCreateShipment}
          />
        )}
      </div>

      <EditOrderModal
        isOpen={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        order={mockOrders.find((o) => o.id === editingOrder) || null}
        editedItems={editedItems}
        onUpdateItem={handleUpdateItem}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Orders;