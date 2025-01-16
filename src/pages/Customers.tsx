import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewCustomerForm from "@/components/customers/NewCustomerForm";
import EditCustomerForm from "@/components/customers/EditCustomerForm";
import { toast } from "sonner";
import { UserPlus, Pencil } from "lucide-react";

const Customers = () => {
  const navigate = useNavigate();
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customersData, setCustomersData] = useState([]);
  const AUTH_TOKEN = "04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch("http://localhost:8080/customers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!customersResponse.ok) throw new Error(`Error: ${customersResponse.status}`);
        const customers = await customersResponse.json();

        const updatedCustomers = await Promise.all(
          customers.map(async (customer) => {
            const orderRes = await fetch(`http://localhost:8080/orders/count/${customer.name}`, {
              headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
            });
            const orderData = await orderRes.json();

            const salesRes = await fetch(`http://localhost:8080/totalSales/${customer.name}`, {
              headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
            });
            const salesData = await salesRes.json();

            return {
              ...customer,
              order_count: orderData.order_count,
              total_sales: salesData.total_sales,
            };
          })
        );

        setCustomersData(updatedCustomers);
      } catch (error) {
        toast.error("Failed to fetch customer data");
      }
    };

    fetchData();
  }, []);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowNewCustomer(false);
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  const handleRowClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <button
  className="add-customer-button"
  onClick={() => setShowNewCustomer(!showNewCustomer)}
>
  <span className="button_lg">
    <span className="button_sl"></span>
    <span className="button_text">
      <UserPlus className="mr-2 h-4 w-4 inline" />
      Add Customer
    </span>
  </span>
</button>

      </div>

      {showNewCustomer ? (
        <NewCustomerForm onCancel={() => setShowNewCustomer(false)} />
      ) : editingCustomer ? (
        <EditCustomerForm customer={editingCustomer} onCancel={handleCancelEdit} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(customer.id)}
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.country}</TableCell>
                  <TableCell>{customer.order_count}</TableCell>
                  <TableCell>${customer.total_sales}</TableCell>
                  <TableCell>
                    <button
                      className="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(customer);
                      }}
                    >
                      <span className="button_lg">
                        <span className="button_sl"></span>
                        <span className="button_text">
                          <Pencil className="h-4 w-4 inline" />
                        </span>
                      </span>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
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
      background-color: #6495ED ;
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

export default Customers;
