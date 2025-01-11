import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for customers - replace with actual data later
const customers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
];

interface OrderItem {
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface OrderFormData {
  orderId: string;
  customerId: string;
  orderDate: string;
  finalDate: string;
  address: string;
  items: OrderItem[];
}

interface NewOrderFormProps {
  orderId: string;
}

const NewOrderForm = ({ orderId }: NewOrderFormProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const form = useForm<OrderFormData>({
    defaultValues: {
      orderId: orderId,
    },
  });

  const addItem = () => {
    setItems([
      ...items,
      { name: "", size: "", color: "", price: 0, quantity: 1 },
    ]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const onSubmit = (data: OrderFormData) => {
    const orderData = {
      ...data,
      items,
      totalPrice: calculateTotal(),
      numberOfItems: items.length,
    };
    console.log("Order submitted:", orderData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Order ID" {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Delivery Address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button type="button" onClick={addItem}>
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(index, "name", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Size"
                        value={item.size}
                        onChange={(e) =>
                          updateItem(index, "size", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Color"
                        value={item.color}
                        onChange={(e) =>
                          updateItem(index, "color", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, "price", parseFloat(e.target.value))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value))
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Items: {items.length}
                </p>
                <p className="text-lg font-semibold">
                  Total Price: ${calculateTotal().toFixed(2)}
                </p>
              </div>
              <Button type="submit">Create Order</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default NewOrderForm;
