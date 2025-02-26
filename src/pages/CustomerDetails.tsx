
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import config from '@/config';

const CustomerDetails = () => {
  const { id } = useParams();
  const customerId = Number(id);
  const navigate = useNavigate();

  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to fetch customer');
      return response.json();
    },
  });

  const { data: shipments = [], isLoading: isLoadingShipments } = useQuery({
    queryKey: ['customerShipments', customerId],
    queryFn: async () => {
      const response = await fetch(
        `${config.apiUrl}${config.customerShipmentEndpoint}/${customerData?.name}`,
        {
          headers: {
            Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch customer shipments');
      return response.json();
    },
    enabled: !!customerData?.name,
  });

  if (isLoadingCustomer) {
    return <div>Loading customer data...</div>;
  }

  if (!customerData) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {customerData.name}
            </p>
            <p>
              <strong>Email:</strong> {customerData.email} <Mail className="inline-block h-4 w-4 ml-1 text-muted-foreground" />
            </p>
            <p>
              <strong>Phone:</strong> {customerData.number} <Phone className="inline-block h-4 w-4 ml-1 text-muted-foreground" />
            </p>
            <p>
              <strong>Address:</strong> {customerData.address}, {customerData.country}
            </p>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h3 className="text-xl font-semibold mb-2">Shipment History</h3>
          {isLoadingShipments ? (
            <div>Loading shipments...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.length > 0 ? (
                    shipments.map((shipment: any) => (
                      <TableRow key={shipment.id}>
                        <TableCell>SHP{shipment.id}</TableCell>
                        <TableCell>ORD{shipment.order_id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Shipped</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No shipments found for this customer.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
