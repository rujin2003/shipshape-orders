export interface OrderItem {
  size: null;
  id: number;
  name: string;
  quantity: number;
  price: number;
  color?: string;
}

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status: string;
  items: OrderItem[];
  dueItems?: OrderItem[];
  address: string;
}