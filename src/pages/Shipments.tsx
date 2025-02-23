
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package, Search, ChevronDown, ChevronRight, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import config from '@/config';
import { Button } from "@/components/ui/button";

interface ShipmentItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Shipment {
  id: number;
  order_id: number;
  shipped_date: string;
  items: ShipmentItem[];
  due_order_type: boolean;
}

const Shipments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shipmentsData, setShipmentsData] = useState<Shipment[]>([]);
  const [expandedShipment, setExpandedShipment] = useState<number | null>(null);
  const navigate = useNavigate();
  const AUTH_TOKEN = "04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK";

  // Fetch shipments data from API
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/shipments`, {
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

  const handleDownload = async (shipmentId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row expansion when clicking download
    
    try {
      // Create a hidden anchor element
      const link = document.createElement('a');
      link.href = `${config.apiUrl}/shipments/${shipmentId}/download`;
      link.setAttribute('download', `shipment-${shipmentId}`);
      link.setAttribute('target', '_blank');
      // Add authorization header through a redirect
      const headers = new Headers({
        'Authorization': `Bearer ${AUTH_TOKEN}`
      });
      
      const response = await fetch(link.href, {
        headers: headers
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      // Get the blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Update the link href with the blob URL
      link.href = url;
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download shipment document");
      console.error("Error downloading shipment:", error);
    }
  };

  const toggleShipmentDetails = (shipmentId: number) => {
    setExpandedShipment(expandedShipment === shipmentId ? null : shipmentId);
  };

  const filteredShipments = shipmentsData.filter((shipment) =>
    shipment.id.toString().includes(searchQuery) ||
    shipment.order_id.toString().includes(searchQuery)
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
        <button className="add-customer-button" onClick={handleCreateShipment}>
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
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Due Order</TableHead>
              <TableHead>Ship Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <React.Fragment key={shipment.id}>
                  <TableRow 
                    className="cursor-pointer"
                    onClick={() => toggleShipmentDetails(shipment.id)}
                  >
                    <TableCell>
                      {expandedShipment === shipment.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">SHP{shipment.id}</TableCell>
                    <TableCell>ORD{shipment.order_id}</TableCell>
                    <TableCell>{shipment.items ? shipment.items.length : 0}</TableCell>
                    <TableCell>{shipment.due_order_type ? "True" : "False"}</TableCell>
                    <TableCell>
                      {shipment.shipped_date ? new Date(shipment.shipped_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={(e) => handleDownload(shipment.id, e)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedShipment === shipment.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/50">
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">Shipped Items</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {shipment.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>${item.price.toFixed(2)}</TableCell>
                                  <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
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
          .add-customer-button {
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

          .add-customer-button::before,
          .add-customer-button::after {
            content: '';
            display: block;
            position: absolute;
            right: 0;
            left: 0;
            height: calc(50% - 5px);
            border: 1px solid #7D8082;
            transition: all 0.15s ease;
          }

          .add-customer-button::before {
            top: 0;
            border-bottom-width: 0;
          }

          .add-customer-button::after {
            bottom: 0;
            border-top-width: 0;
          }

          .add-customer-button:active,
          .add-customer-button:focus {
            outline: none;
          }

          .add-customer-button:active::before,
          .add-customer-button:active::after {
            right: 3px;
            left: 3px;
          }

          .add-customer-button:active::before {
            top: 3px;
          }

          .add-customer-button:active::after {
            bottom: 3px;
          }

          .add-customer-button .button_lg {
            position: relative;
            display: block;
            padding: 10px 20px;
            color: #fff;
            background-color: #0f1923;
            overflow: hidden;
            box-shadow: inset 0px 0px 0px 1px transparent;
          }

          .add-customer-button .button_lg::before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 2px;
            background-color: #0f1923;
          }

          .add-customer-button .button_lg::after {
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

          .add-customer-button .button_sl {
            display: block;
            position: absolute;
            top: 0;
            bottom: -1px;
            left: -8px;
            width: 0;
            background-color: #6495ED;
            transform: skew(-15deg);
            transition: all 0.2s ease;
          }

          .add-customer-button .button_text {
            position: relative;
          }

          .add-customer-button:hover {
            color: #0f1923;
          }

          .add-customer-button:hover .button_sl {
            width: calc(100% + 15px);
          }

          .add-customer-button:hover .button_lg::after {
            background-color: #fff;
          }
        `}
      </style>
    </div>
  );
};

export default Shipments;

