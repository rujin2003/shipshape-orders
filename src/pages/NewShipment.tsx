import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import config from '@/config';

const NewShipment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId, selectedItems, orderDetails } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!orderDetails) {
    return <div>No order details found</div>;
  }

  // Filter selected items and get their full details
  const selectedOrderItems = orderDetails.items.filter((item) =>
    selectedItems.includes(item.id)
  );

  const handleCreateShipment = async () => {
    setLoading(true);

    // Construct the shipment data to match API expectations
    const shipmentData = {
      order_id: orderId,
      shipped_date: new Date().toISOString(),
      items: selectedOrderItems.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity, // Ensure quantity is included
      })),
      due_order_type: false,
    };

    console.log("Final shipment request:", JSON.stringify(shipmentData, null, 2)); // Debugging log

    try {
    
      const response = await fetch(`${config.apiUrl}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK",
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create shipment");
      }

      toast({
        title: "Success",
        description: "Shipment created successfully!",
       
      });

      navigate("/shipments");
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast({
        title: "Error",
        description: "Failed to create shipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <p><strong>Name:</strong> {orderDetails.customer_name}</p>
              <p><strong>Address:</strong> {orderDetails.shipment_address}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items to Ship</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCreateShipment}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                {loading ? "Creating..." : "Create Shipment"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewShipment;
