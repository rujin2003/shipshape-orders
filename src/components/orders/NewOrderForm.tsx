import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: number;
  name: string;
  number: number;
  email: string;
  country: string;
  address: string;
}

interface OrderItem {
  id?: number; // Optional since new items won't have an ID initially
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    defaultValues: {
      orderId: orderId,
      orderDate: "",
      finalDate: "",
      address: "",
      items: [],
    },
  });

  useEffect(() => {
    fetch("http://localhost:8080/customers", {
      method: "GET",
      headers: {
        Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again.");
        setLoading(false);
      });
  }, []);

  const addItem = () => {
    setItems([...items, { name: "", size: "", color: "", price: 0, quantity: 1 }]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const onSubmit = async (data: OrderFormData) => {
    const selectedCustomer = customers.find((c) => c.id === parseInt(data.customerId));

    const orderPayload = {
      id: parseInt(data.orderId.replace("ORD", "")),
      customer_id: parseInt(data.customerId),
      customer_name: selectedCustomer?.name || "",
      order_date: new Date(data.orderDate).toISOString(),
      shipment_due: new Date(data.finalDate).toISOString(),
      shipment_address: data.address,
      order_status: "pending",
      items: items.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString()),
        quantity: parseInt(item.quantity.toString()),
      })),
      total_price: parseFloat(calculateTotal().toFixed(2)),
      no_of_items: items.length,
    };

    try {
      const response = await fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast({
        title: "Order Created",
        description: "The new order has been successfully created.",
      });

      form.reset();
      setItems([]);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p>Loading customers...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Selection */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name} - {customer.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter delivery address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Order Date and Shipment Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <FormLabel>Shipment Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button type="button" onClick={addItem}>
                + Add Item
              </Button>
              {items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <Input
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Size"
                      value={item.size}
                      onChange={(e) => updateItem(index, "size", e.target.value)}
                    />
                    <Input
                      placeholder="Color"
                      value={item.color}
                      onChange={(e) => updateItem(index, "color", e.target.value)}
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
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <p>Total Price: ${calculateTotal().toFixed(2)}</p>
              <Button type="submit">Create Order</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default NewOrderForm;
