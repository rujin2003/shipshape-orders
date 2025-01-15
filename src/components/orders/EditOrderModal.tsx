import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order, OrderItem } from "@/types/order";
import OrderItemComponent from "./OrderItem";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  editedItems: OrderItem[];
  onUpdateItem: (index: number, field: string, value: any) => void;
  onSave: () => void;
}

const EditOrderModal = ({
  isOpen,
  onClose,
  order,
  editedItems,
  onUpdateItem,
  onSave,
}: EditOrderModalProps) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order Items</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editedItems.map((item, index) => (
            <OrderItemComponent
              key={item.id}
              item={item}
              editable={true}
              onQuantityChange={(_, quantity) =>
                onUpdateItem(index, "quantity", quantity)
              }
              onColorChange={(_, color) => onUpdateItem(index, "color", color)}
            />
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;