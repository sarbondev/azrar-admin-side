import type { ProductEntity } from "@/entities/product/model/types";

export type OrderStatus = "in_process" | "delivered" | "cancelled";

export interface OrderCustomer {
  fullName: string;
  phoneNumber: string;
  address: string;
}

export interface OrderProduct {
  product: ProductEntity;
  quantity: number;
  price: number;
}

export interface OrderEntity {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: OrderCustomer;
  products: OrderProduct[];
  totalPrice: number;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
