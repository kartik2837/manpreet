import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { type Product } from "../../types/productTypes";
import { type Address } from "../../types/userTypes";
import { api } from "../../Config/Api";

// State type
interface BuyNowState {
    product: Product | null;
    quantity: number;
    size: string;
    loading: boolean;
    error: string | null;
}

const initialState: BuyNowState = {
    product: null,
    quantity: 1,
    size: "FREE",
    loading: false,
    error: null,
};

// Async thunk: Create buy now order
export const createBuyNowOrder = createAsyncThunk<
    any,
    { address: Address; jwt: string; paymentGateway: string; productId: string; quantity: number; size: string }
>("buyNow/createBuyNowOrder", async ({ address, jwt, paymentGateway, productId, quantity, size }, { rejectWithValue }) => {
    try {
        const response = await api.post(
            "/api/orders/buy-now",
            { shippingAddress: address, productId, quantity, size },
            {
                headers: { Authorization: `Bearer ${jwt}` },
                params: { paymentMethod: paymentGateway },
            }
        );

        if (response.data.payment_link_url) {
            window.location.href = response.data.payment_link_url;
        }

        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to create buy now order");
    }
});

// Slice
const buyNowSlice = createSlice({
    name: "buyNow",
    initialState,
    reducers: {
        setBuyNowProduct: (
            state,
            action: PayloadAction<{ product: Product; quantity: number; size: string }>
        ) => {
            state.product = action.payload.product;
            state.quantity = action.payload.quantity;
            state.size = action.payload.size;
            state.error = null;
        },
        clearBuyNow: (state) => {
            state.product = null;
            state.quantity = 1;
            state.size = "FREE";
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBuyNowOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBuyNowOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createBuyNowOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setBuyNowProduct, clearBuyNow } = buyNowSlice.actions;
export default buyNowSlice.reducer;
