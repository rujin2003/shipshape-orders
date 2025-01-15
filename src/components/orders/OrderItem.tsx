import { Input } from "@/components/ui/input";
import { OrderItem as OrderItemType } from "@/types/order";

interface OrderItemProps {
  item: OrderItemType;
  isSelected?: boolean;
  onSelect?: (itemId: number) => void;
  onQuantityChange?: (itemId: number, quantity: number) => void;
  onColorChange?: (itemId: number, color: string) => void;
  editable?: boolean;
}

const OrderItem = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onColorChange,
  editable = false,
}: OrderItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          className="h-4 w-4"
        />
      )}
      <span>{item.name}</span>
      {editable ? (
        <>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onQuantityChange?.(item.id, parseInt(e.target.value))
            }
            className="w-20"
          />
          <Input
            type="text"
            placeholder="Color"
            value={item.color || ""}
            onChange={(e) => onColorChange?.(item.id, e.target.value)}
            className="w-32"
          />
        </>
      ) : (
        <>
          <span>Quantity: {item.quantity}</span>
          <span>Price: ${item.price}</span>
        </>
      )}
    </div>
  );
};

export default OrderItem;