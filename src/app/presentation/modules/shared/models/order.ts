import { OrderItem } from "./orderItem";

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  orderTotal: number;
  orderItems: OrderItem[];
}
