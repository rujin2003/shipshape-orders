import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Shipments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shipmentsData, setShipmentsData] = useState([]); // ✅ Initialize as empty array
  const navigate = useNavigate();
  const AUTH_TOKEN = "04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK";

  // Fetch shipments data from API
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch("http://localhost:8080/shipments", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setShipmentsData(data || []);  // ✅ Ensure data is an array
      } catch (error) {
        toast.error("Failed to fetch shipments data");
        console.error("Error fetching shipments:", error);
      }
    };

    fetchShipments();
  }, []);

  const handleCreateShipment = () => {
    navigate("/shipments/create");
  };

  // ✅ Safely filter shipments
  const filteredShipments = shipmentsData.length
    ? shipmentsData.filter((shipment) =>
        shipment.id.toString().includes(searchQuery) ||
        shipment.order_id.toString().includes(searchQuery)
      )
    : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
        <Button onClick={handleCreateShipment}>
          <Package className="mr-2 h-4 w-4" /> Create Shipment
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shipments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Due Order</TableHead>
              <TableHead>Ship Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">SHP{shipment.id}</TableCell>
                  <TableCell>ORD{shipment.order_id}</TableCell>
                  <TableCell>{shipment.items ? shipment.items.length : 0}</TableCell>
                  <TableCell>{shipment.due_order_type ? "True" : "False"}</TableCell>
                  <TableCell>{shipment.shipped_date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No shipments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Shipments;
