import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { type Order } from "../../types/orderTypes";

interface AdminOrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchAdminOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("adminOrders/fetchAdminOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/orders/admin");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
});

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  },
});

export default adminOrdersSlice.reducer;
