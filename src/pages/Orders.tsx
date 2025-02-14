import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OrderList from "@/components/orders/OrderList";
import EditOrderModal from "@/components/orders/EditOrderModal";
import { Order, OrderItem } from "@/types/order";
import config from '@/config';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    
    fetch(`${config.apiUrl}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // Ensure response is an array; if not, set an empty array
        const mappedOrders: Order[] = Array.isArray(data)
          ? data.map((order: any) => ({
              id: order.id.toString(),
              originalId: order.id,
              customerName: order.customer_name,
              orderDate: new Date(order.order_date).toLocaleDateString(),
              status: order.order_status,
              items: order.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              address: order.shipment_address,
            }))
          : [];

        setOrders(mappedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-end p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>

        {/* Updated Create Order Button */}
        <button
          className="add-customer-button"
          onClick={() => navigate(`/orders/new`)}
        >
          <span className="button_lg">
            <span className="button_sl"></span>
            <span className="button_text">
              <Package className="mr-2 h-4 w-4 inline" />
              Create Order
            </span>
          </span>
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        {orders.length > 0 ? (
          <OrderList
            orders={orders}
            expandedOrder={expandedOrder}
            onOrderClick={(orderId) =>
              setExpandedOrder(expandedOrder === orderId ? null : orderId)
            }
            onEditOrder={(orderId) => {
              const order = orders.find((o) => o.id === orderId);
              if (order) {
                setEditedItems([...order.items]);
                setEditingOrder(orderId);
              }
            }}
            selectedItems={selectedItems}
            onItemSelect={(itemId) =>
              setSelectedItems((prev) =>
                prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
              )
            }
            onCreateShipment={(orderId) => {
              if (selectedItems.length === 0) {
                toast({
                  title: "Error",
                  description: "Please select at least one item to ship.",
                  variant: "destructive",
                });
                return;
              }

              const order = orders.find((order) => order.id === orderId);
              if (!order) return;

              navigate(`/shipments/new`, {
                state: {
                  orderId,
                  selectedItems,
                  orderDetails: order,
                },
              });
            }}
            onDeleteOrder={async (orderId) => {
              try {
                const order = orders.find((o) => o.id === orderId);
                if (!order) {
                  toast({
                    title: "Error",
                    description: "Order not found.",
                    variant: "destructive",
                  });
                  return;
                }
                

                const response = await fetch(`${config.apiUrl}/orders/${order.id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
                    "Content-Type": "application/json",
                  },
                });

                if (!response.ok) throw new Error(`Failed to delete order with ID: ${order.id}`);

                toast({
                  title: "Order Deleted",
                  description: "The order has been successfully deleted.",
                });

                setOrders((prevOrders) => prevOrders.filter((o) => o.id !== orderId));

                if (expandedOrder === orderId) {
                  setExpandedOrder(null);
                }
              } catch (error) {
                console.error("Error deleting order:", error);
                toast({
                  title: "Error",
                  description: "Failed to delete the order. Please try again.",
                  variant: "destructive",
                });
              }
            }}
          />
        ) : (
          <div className="flex justify-center items-center p-4">
            <p className="text-gray-500 italic">No orders</p>
          </div>
        )}
      </div>

      <EditOrderModal
        isOpen={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        order={orders.find((o) => o.id === editingOrder) || null}
        editedItems={editedItems}
        onUpdateItem={(index, field, value) => {
          const updatedItems = [...editedItems];
          updatedItems[index] = { ...updatedItems[index], [field]: value };
          setEditedItems(updatedItems);
        }}
        onSave={() => {
          toast({
            title: "Order Updated",
            description: "The order has been successfully updated.",
          });
          setEditingOrder(null);
        }}
      />

      {/* Add the same CSS styles for the button */}
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

export default Orders;