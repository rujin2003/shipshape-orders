import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

interface EditCustomerFormProps {
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    country: string;
    address: string;
  };
  onCancel: () => void;
}

const EditCustomerForm = ({ customer, onCancel }: EditCustomerFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      country: customer.country,
      address: customer.address,
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:8080/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to update customer");

      toast.success("Customer updated successfully!");
      onCancel();
    } catch (error) {
      toast.error("Error updating customer");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Input placeholder="Name" {...form.register("name")} />
        <Input placeholder="Phone" {...form.register("phone")} />
        <Input placeholder="Email" type="email" {...form.register("email")} />
        <Input placeholder="Country" {...form.register("country")} />
        <Input placeholder="Address" {...form.register("address")} />
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">Update Customer</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCustomerForm;
