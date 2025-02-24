
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Order, OrderItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import config from "@/config";

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [updatedItems, setUpdatedItems] = useState<OrderItem[]>([]);
  const [newItems, setNewItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    size: "",
    color: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrder(data);
        setUpdatedItems(data.items);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        });
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setUpdatedItems(
      updatedItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleAddNewItem = () => {
    if (!newItem.name || !newItem.price || !newItem.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setNewItems([...newItems, {
      name: newItem.name,
      size: newItem.size || null,
      color: newItem.color || null,
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity),
    }]);

    setNewItem({
      name: "",
      size: "",
      color: "",
      price: "",
      quantity: "",
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        },
        body: JSON.stringify({
          updated_items: updatedItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
          new_items: newItems,
        }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      navigate("/orders");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  if (!order) return null;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Edit Order #{orderId}</h2>

      <div>
        <h3 className="font-semibold mb-4">Existing Items</h3>
        {updatedItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 mb-4">
            <span className="flex-1">{item.name}</span>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-4">Add New Items</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            placeholder="Size"
            value={newItem.size}
            onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
          />
          <Input
            placeholder="Color"
            value={newItem.color}
            onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />
          <Button onClick={handleAddNewItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {newItems.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">New Items to Add</h3>
          <div className="border rounded-md p-4">
            {newItems.map((item, index) => (
              <div key={index} className="mb-2">
                <p>{item.name} - Qty: {item.quantity}, Price: ${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => navigate("/orders")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditOrder;
