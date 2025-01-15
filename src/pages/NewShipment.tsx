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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const NewShipment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId, selectedItems, orderDetails } = location.state || {};

  if (!orderDetails) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1F2C]">No order details found</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate("/shipments")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
          </Button>
        </div>
      </div>
    );
  }

  const selectedOrderItems = orderDetails.items.filter((item: any) =>
    selectedItems.includes(item.id)
  );

  const handleCreateShipment = () => {
    console.log("Creating shipment for items:", selectedOrderItems);
    
    toast({
      title: "Success",
      description: "Shipment created successfully",
    });
    
    navigate("/shipments");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-[#F1F1F1]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1F2C]">
          Create Shipment - {orderId}
        </h2>
        <Button 
          variant="outline" 
          onClick={() => navigate("/shipments")}
          className="w-full md:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
        </Button>
      </div>

      <Card className="border-[#D6BCFA] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1A1F2C]">Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-[#1A1F2C]">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#333333]">
                <p>Name: {orderDetails.customerName}</p>
                <p>Address: {orderDetails.address}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-[#1A1F2C]">Items to Ship</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#9b87f5] text-white">
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrderItems.map((item: any) => (
                      <TableRow key={item.id} className="hover:bg-[#F2FCE2]">
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleCreateShipment}
                className="bg-[#9b87f5] hover:bg-[#7a63f1] text-white"
              >
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