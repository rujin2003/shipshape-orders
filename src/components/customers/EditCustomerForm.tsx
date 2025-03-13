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
import { API_ENDPOINTS, getAuthHeader } from "@/constants/apiEndpoints";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  number: z.preprocess(
    (val) => (typeof val === "string" ? val.replace(/\D/g, "") : val),
    z.string().min(10, "Phone number must be at least 10 digits")
  ),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

interface EditCustomerFormProps {
  customer: {
    id: number;
    name: string;
    email: string;
    number: string;
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
      number: customer.number,
      email: customer.email,
      country: customer.country,
      address: customer.address,
    },
  });

  const onSubmit = async (values: any) => {
   
    try {
    
      const payload = { ...values, numbere: values.number.trim() };
      const response = await fetch(API_ENDPOINTS.CUSTOMERS.UPDATE(customer.id), {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
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
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="number" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="Phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="country" render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="Country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

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
