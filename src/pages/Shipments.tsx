import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Shipments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shipmentsData, setShipmentsData] = useState([]);
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
        setShipmentsData(data || []);
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

  const filteredShipments = shipmentsData.filter((shipment) =>
    shipment.id.toString().includes(searchQuery) ||
    shipment.order_id.toString().includes(searchQuery)
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
        <button
          className="button"
          onClick={handleCreateShipment}
        >
          <span className="button_lg">
            <span className="button_sl"></span>
            <span className="button_text">
              <Package className="mr-2 h-4 w-4 inline" />
              Create Shipment
            </span>
          </span>
        </button>
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
        <div className="flex items-center justify-center space-x-4">
         
          <span>No shipments found.</span>
        </div>
      </TableCell>
    </TableRow>
  )}
</TableBody>


        </Table>
      </div>

      <style>
        {`
          button {
            -moz-appearance: none;
            -webkit-appearance: none;
            appearance: none;
            border: none;
            background: none;
            color: #0f1923;
            cursor: pointer;
            position: relative;
            padding: 8px;
            margin-bottom: 20px;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.15s ease;
          }

          .button::before,
          .button::after {
            content: '';
            display: block;
            position: absolute;
            right: 0;
            left: 0;
            height: calc(50% - 5px);
            border: 1px solid #7D8082;
            transition: all 0.15s ease;
          }

          .button::before {
            top: 0;
            border-bottom-width: 0;
          }

          .button::after {
            bottom: 0;
            border-top-width: 0;
          }

          .button:active,
          .button:focus {
            outline: none;
          }

          .button:active::before,
          .button:active::after {
            right: 3px;
            left: 3px;
          }

          .button:active::before {
            top: 3px;
          }

          .button:active::after {
            bottom: 3px;
          }

          .button_lg {
            position: relative;
            display: block;
            padding: 10px 20px;
            color: #fff;
            background-color: #0f1923;
            overflow: hidden;
            box-shadow: inset 0px 0px 0px 1px transparent;
          }

          .button_lg::before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 2px;
            background-color: #0f1923;
          }

          .button_lg::after {
            content: '';
            display: block;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 4px;
            height: 4px;
            background-color: #0f1923;
            transition: all 0.2s ease;
          }

          .button_sl {
            display: block;
            position: absolute;
            top: 0;
            bottom: -1px;
            left: -8px;
            width: 0;
            background-color: #6495ED ;
            transform: skew(-15deg);
            transition: all 0.2s ease;
          }

          .button_text {
            position: relative;
          }

          .button:hover {
            color: #0f1923;
          }

          .button:hover .button_sl {
            width: calc(100% + 15px);
          }

          .button:hover .button_lg::after {
            background-color: #fff;
          }
        `}
      </style>
    </div>
  );
};

export default Shipments;
