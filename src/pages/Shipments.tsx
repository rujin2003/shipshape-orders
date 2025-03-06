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
        <Button 
          onClick={handleCreateShipment}
          size="sm" 
          className="flex items-center gap-2 text-xs md:text-sm create-action-button"
        >
          <Package className="h-3 w-3 md:h-4 md:w-4" />
          Create Shipment
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
                          {expandedShipment === shipment.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
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
    </div>
  );
};

export default Shipments;
