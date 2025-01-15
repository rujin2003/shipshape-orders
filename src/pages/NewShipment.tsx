import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const NewShipment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId, selectedItems, orderDetails } = location.state || {};

  if (!orderDetails) {
    return <div>No order details found</div>;
  }

  const selectedOrderItems = orderDetails.items.filter((item: any) =>
    selectedItems.includes(item.id)
  );

  const handleCreateShipment = () => {
    // Here you would typically make an API call to create the shipment
    console.log("Creating shipment for items:", selectedOrderItems);
    
    toast({
      title: "Success",
      description: "Shipment created successfully",
    });
    
    navigate("/shipments");
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Create Shipment - {orderId}
        </h2>
        <Button variant="outline" onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>Name: {orderDetails.customerName}</p>
              <p>Address: {orderDetails.address}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items to Ship</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrderItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreateShipment}>
                Create Shipment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewShipment;