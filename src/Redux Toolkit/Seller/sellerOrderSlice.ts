// src/redux/slices/sellerOrderSlice.ts

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type Order, type OrderStatus } from "../../types/orderTypes";
import { type ApiResponse } from "../../types/authTypes";
import { api, DEPLOYED_URL } from "../../Config/Api";

interface SellerOrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  labelUrl: string | null;
}

const initialState: SellerOrderState = {
  orders: [],
  loading: false,
  error: null,
  labelUrl: null,
};

/* ================== THUNKS ================== */

// Fetch seller orders
export const fetchSellerOrders = createAsyncThunk<Order[], string>(
  "sellerOrders/fetchSellerOrders",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/seller/orders", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch seller orders"
      );
    }
  }
);

// Accept Order (New)
export const acceptOrder = createAsyncThunk<
  Order,
  { jwt: string; orderId: string }
>("sellerOrders/acceptOrder", async ({ jwt, orderId }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/api/seller/orders/${orderId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    return response.data.order;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to accept order"
    );
  }
});

// Reject Order (New)
export const rejectOrder = createAsyncThunk<
  Order,
  { jwt: string; orderId: string; reason: string }
>("sellerOrders/rejectOrder", async ({ jwt, orderId, reason }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/api/seller/orders/${orderId}/reject`,
      { reason },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    return response.data.order;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to reject order"
    );
  }
});

// Pack Order (New)
export const packOrder = createAsyncThunk<
  Order,
  { jwt: string; orderId: string }
>("sellerOrders/packOrder", async ({ jwt, orderId }, { rejectWithValue }) => {
  try {
    const response = await api.patch(
      `/api/seller/orders/${orderId}/pack`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    return response.data.order;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to pack order"
    );
  }
});

// Update order status (Legacy/Generic)
export const updateOrderStatus = createAsyncThunk<
  Order,
  { jwt: string; orderId: string; orderStatus: OrderStatus }
>(
  "sellerOrders/updateOrderStatus",
  async ({ jwt, orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/seller/orders/${orderId}/status/${orderStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update order status"
      );
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk<
  ApiResponse,
  { jwt: string; orderId: string }
>(
  "sellerOrders/deleteOrder",
  async ({ jwt, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/seller/orders/${orderId}/delete`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete order"
      );
    }
  }
);

// Request Pickup (New)
export const requestPickup = createAsyncThunk<
  Order,
  { jwt: string; orderId: string }
>("sellerOrders/requestPickup", async ({ jwt, orderId }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/api/seller/orders/${orderId}/request-pickup`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    return response.data.order;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to request pickup"
    );
  }
});

// Fetch Shipping Label (New)
export const fetchShippingLabel = createAsyncThunk<
  string,
  { jwt: string; orderId: string }
>("sellerOrders/fetchShippingLabel", async ({ jwt, orderId }) => {
  // Return the URL of our proxy endpoint with the JWT attached
  return `${DEPLOYED_URL}/api/seller/orders/${orderId}/shipping-label?token=${jwt}`;
});

/* ================== SLICE ================== */

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- Fetch orders --- */
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSellerOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Update order status --- */
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((order) => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Accept Order --- */
      .addCase(acceptOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((order) => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Reject Order --- */
      .addCase(rejectOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((order) => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(rejectOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Pack Order --- */
      .addCase(packOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(packOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((order) => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(packOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Delete order --- */
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.meta.arg.orderId
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Request Pickup --- */
      .addCase(requestPickup.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestPickup.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(requestPickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- Fetch Shipping Label --- */
      .addCase(fetchShippingLabel.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippingLabel.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.labelUrl = action.payload;
        // Automatically open the label in a new tab if it's a valid string URL
        if (action.payload && typeof action.payload === 'string' && action.payload.startsWith('http')) {
          window.open(action.payload, '_blank');
        } else if (action.payload && typeof action.payload === 'string') {
          // Handle cases where it might be a relative URL or other string
          window.open(action.payload, '_blank');
        } else {
          console.warn('[SellerOrderSlice] Invalid label URL received:', action.payload);
        }
      })
      .addCase(fetchShippingLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = sellerOrderSlice.actions;
export default sellerOrderSlice.reducer;
