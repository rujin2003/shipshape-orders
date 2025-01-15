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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Shipments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleCreateShipment = () => {
    navigate("/shipments/create");
  };

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
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tracking No.</TableHead>
              <TableHead>Ship Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">SHP001</TableCell>
              <TableCell>ORD001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>In Transit</TableCell>
              <TableCell>TRK123456789</TableCell>
              <TableCell>2024-03-20</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Shipments;