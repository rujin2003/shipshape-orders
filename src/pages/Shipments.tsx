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
import { Package, Search, ChevronDown, ChevronRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import config from '@/config';
import { Button } from "@/components/ui/button";
import ShipmentViewModal from "@/components/shipments/ShipmentViewModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const [viewShipmentId, setViewShipmentId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isVerySmall = useMediaQuery("(max-width: 500px)");

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
    e.stopPropagation();
    
    try {
      const link = document.createElement('a');
      link.href = `${config.apiUrl}/shipments/${shipmentId}/download`;
      link.setAttribute('download', `shipment-${shipmentId}`);
      link.setAttribute('target', '_blank');
      const headers = new Headers({
        'Authorization': `Bearer ${AUTH_TOKEN}`
      });
      
      const response = await fetch(link.href, {
        headers: headers
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mobile-title-spacing">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shipments</h2>

        <button
          className="add-customer-button create-action-button"
          onClick={handleCreateShipment}
        >
          <span className="button_lg">
            <span className="button_sl"></span>
            <span className="button_text">
              <Package className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 inline" />
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
        <div className={`${isMobile ? "responsive-table mobile-table-layout" : ""} ${isVerySmall ? "mobile-stacked-table" : ""}`}>
          <Table>
            <TableHeader>
              <TableRow>
                {!isVerySmall && <TableHead className="w-[50px]"></TableHead>}
                <TableHead>Shipment ID</TableHead>
                <TableHead>Order ID</TableHead>
                {!isVerySmall && <TableHead>Items Count</TableHead>}
                {!isVerySmall && <TableHead>Due Order</TableHead>}
                <TableHead>Ship Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <React.Fragment key={shipment.id}>
                    <TableRow className="cursor-pointer" onClick={() => isVerySmall ? setViewShipmentId(shipment.id) : toggleShipmentDetails(shipment.id)}>
                      {!isVerySmall && (
                        <TableCell>
                        
                        </TableCell>
                      )}
                      <TableCell className="font-medium truncate-mobile" data-label="Shipment ID">SHP{shipment.id}</TableCell>
                      <TableCell className="truncate-mobile" data-label="Order ID">ORD{shipment.order_id}</TableCell>
                      {!isVerySmall && <TableCell data-label="Items Count">{shipment.items ? shipment.items.length : 0}</TableCell>}
                      {!isVerySmall && <TableCell data-label="Due Order">{shipment.due_order_type ? "True" : "False"}</TableCell>}
                      <TableCell data-label="Ship Date">
                        {shipment.shipped_date ? new Date(shipment.shipped_date).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell data-label="Actions">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mobile-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewShipmentId(shipment.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isVerySmall ? 4 : 7} className="text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <span>No shipments found.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ShipmentViewModal
        shipment={shipmentsData.find((s) => s.id === viewShipmentId)}
        isOpen={!!viewShipmentId}
        onClose={() => setViewShipmentId(null)}
        onDownload={handleDownload}
      />
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
      padding: 8px 12px;
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

    /* Responsive Styles */
    @media (max-width: 640px) {
      .add-customer-button {
        padding: 5px 10px;
        font-size: 12px;
      }

      .add-customer-button .button_lg {
        padding: 6px 14px;
      }

      .add-customer-button .button_text {
        font-size: 12px;
      }

      .add-customer-button .button_sl {
        left: -5px;
      }
    }
  `}
</style>
    </div>
  );
};

export default Shipments;
