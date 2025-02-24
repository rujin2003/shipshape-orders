
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Order, OrderItem } from "@/types/order";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import config from "@/config";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  editedItems: OrderItem[];
  onSave: () => void;
}

const EditOrderModal = ({
  isOpen,
  onClose,
  order,
  editedItems,
  onSave,
}: EditOrderModalProps) => {
  const [updatedItems, setUpdatedItems] = useState<OrderItem[]>(editedItems);
  const [newItems, setNewItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    size: "",
    color: "",
    price: "",
    quantity: "",
  });
  const { toast } = useToast();

  if (!order) return null;

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
      const response = await fetch(`${config.apiUrl}/orders/${order.id}`, {
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

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Order Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Existing Items</h3>
            {updatedItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 mb-2">
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
            <h3 className="font-semibold mb-2">Add New Item</h3>
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
              <h3 className="font-semibold mb-2">New Items to Add</h3>
              <div className="border rounded-md p-4">
                {newItems.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p>{item.name} - Qty: {item.quantity}, Price: ${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;
