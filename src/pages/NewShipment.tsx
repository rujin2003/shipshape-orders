
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
  const { orderId, selectedItems, orderDetails, isDueOrder } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!orderDetails) {
    return <div>No order details found</div>;
  }

  const selectedOrderItems = orderDetails.items.filter((item) =>
    selectedItems.includes(item.id)
  );

  const handleCreateShipment = async () => {
    setLoading(true);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const shipmentData = {
      shipped_date: formattedDate,
      order_id: orderId,
      items: selectedOrderItems.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
      })),
      due_order_type: isDueOrder ? true : false,
    };

    try {
      const response = await fetch(`${config.apiUrl}${config.createShipmentEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK",
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server response:", errorData);
        throw new Error(errorData?.message || "Failed to create shipment");
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
        description: error instanceof Error ? error.message : "Failed to create shipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight truncate">
          Create Shipment - {orderId}
        </h2>
        <Button variant="outline" onClick={() => navigate(-1)} className="self-start">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
              <p className="break-words"><strong>Address:</strong> {orderDetails.shipment_address}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items to Ship</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle p-4 md:p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[120px] md:max-w-none truncate">{item.name}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.color}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCreateShipment}
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
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
