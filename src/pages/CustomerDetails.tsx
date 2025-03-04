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
import { ArrowLeft, Mail, Phone, Package, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['customerOrders', customerId],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/orders?customer_id=${customerId}`, {
        headers: {
          Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to fetch customer orders');
      return response.json();
    },
    enabled: !!customerId,
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
    return <div className="flex items-center justify-center h-screen">Loading customer data...</div>;
  }

  if (!customerData) {
    return <div className="flex items-center justify-center h-screen">Customer not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-3 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Customer Details</h2>
        <Button variant="outline" onClick={() => navigate(-1)} className="self-start">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader className="md:pb-2">
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{customerData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium flex items-center">
                {customerData.email}
                <Mail className="ml-2 h-4 w-4 text-muted-foreground" />
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-lg font-medium flex items-center">
                {customerData.number}
                <Phone className="ml-2 h-4 w-4 text-muted-foreground" />
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-lg font-medium">{customerData.address}, {customerData.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {isLoadingOrders ? (
              <div>Loading orders...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell>ORD{order.id}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${order.total}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No orders found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {isLoadingShipments ? (
              <div>Loading shipments...</div>
            ) : (
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
                      <TableCell colSpan={3} className="text-center">No shipments found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetails;
