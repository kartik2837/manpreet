import { type Product } from './productTypes';
import { type Address, type User } from './userTypes';

export interface OrderState {
    orders: Order[];
    parentOrders: ParentOrder[]; // Added for ParentOrder support
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any | null;
    loading: boolean;
    error: string | null;
    orderCanceled: boolean;
}

// Parent Order groups seller-wise sub-orders
export interface ParentOrder {
    _id: string;
    user: User;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: OrderStatus;
    shippingAddress: Address;
    createdAt: string;
    subOrders: Order[]; // Sub-orders belonging to this parent
}

import { type Seller } from './sellerTypes';

// SubOrder (referred to as Order in the codebase)
export interface Order {
    _id: string;
    orderId: string;
    user: User;
    seller: Seller; // Added to support populated seller info
    sellerId: string; // Changed to string as it's an ObjectId ref
    parentOrder: string | ParentOrder; // Reference to ParentOrder
    orderItems: OrderItem[];
    orderDate: string;
    shippingAddress: Address;
    paymentDetails: {
        status: string;
        method: string;
    } | null;
    paymentMethod: string; // Added back
    paymentStatus: string; // Added back
    paymentLinkUrl: string | null; // Added back
    totalMrpPrice: number;
    totalSellingPrice: number;
    discount: number;
    orderStatus: OrderStatus;
    deliveryStatus: DeliveryStatus;
    totalItem: number;
    deliverDate: string;

    // Shipment & Tracking
    shipmentId: string | null;
    trackingId: string | null;
    trackingLink: string | null;

    // Financials
    sellerAmount: number;
    commissionAmount: number;
    commissionRate: number;

    // Timestamps
    packedAt: string | null;
    shippedAt: string | null;
    deliveredAt: { type: Date, default: null },

    // ─── Delhivery B2C Integration ──────────────────────────────────────
    pickupRequested: boolean;
    podUrl: string | null;
    warehouseCode: string | null;
}

export type OrderStatus =
    | "PENDING"
    | "PLACED"
    | "CONFIRMED"
    | "PACKED"
    | "SHIPPED"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED"
    | "RTO";

export type DeliveryStatus =
    | "PENDING"
    | "SHIPPED"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "RETURNED"
    | "RTO"
    | "CANCELLED";

export interface OrderItem {
    _id: string; // Changed to string (ObjectId)
    order: Order;
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: string;
}
