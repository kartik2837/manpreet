import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

export interface ReturnRequest {
    _id: string;
    order: any;
    user: any;
    seller: any;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";
    createdAt: string;
}

interface AdminReturnState {
    returns: ReturnRequest[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminReturnState = {
    returns: [],
    loading: false,
    error: null,
};

export const fetchAdminReturns = createAsyncThunk<
    ReturnRequest[],
    string,
    { rejectValue: string }
>("adminReturn/fetchAdminReturns", async (jwt, { rejectWithValue }) => {
    try {
        const response = await api.get("/api/returns/admin", {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch returns");
    }
});

export const approveReturn = createAsyncThunk<
    ReturnRequest,
    { returnId: string; jwt: string },
    { rejectValue: string }
>("adminReturn/approveReturn", async ({ returnId, jwt }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/api/returns/admin/${returnId}/approve`, {}, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return response.data.returnRequest;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to approve return");
    }
});

export const rejectReturn = createAsyncThunk<
    ReturnRequest,
    { returnId: string; jwt: string },
    { rejectValue: string }
>("adminReturn/rejectReturn", async ({ returnId, jwt }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/api/returns/admin/${returnId}/reject`, {}, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return response.data.returnRequest;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to reject return");
    }
});

export const markRefunded = createAsyncThunk<
    ReturnRequest,
    { returnId: string; jwt: string },
    { rejectValue: string }
>("adminReturn/markRefunded", async ({ returnId, jwt }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/api/returns/admin/${returnId}/refunded`, {}, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return response.data.returnRequest;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to mark as refunded");
    }
});

const adminReturnSlice = createSlice({
    name: "adminReturn",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminReturns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminReturns.fulfilled, (state, action: PayloadAction<ReturnRequest[]>) => {
                state.loading = false;
                state.returns = action.payload;
            })
            .addCase(fetchAdminReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(approveReturn.fulfilled, (state, action: PayloadAction<ReturnRequest>) => {
                const index = state.returns.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) state.returns[index] = action.payload;
            })
            .addCase(rejectReturn.fulfilled, (state, action: PayloadAction<ReturnRequest>) => {
                const index = state.returns.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) state.returns[index] = action.payload;
            })
            .addCase(markRefunded.fulfilled, (state, action: PayloadAction<ReturnRequest>) => {
                const index = state.returns.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) state.returns[index] = action.payload;
            });
    },
});

export default adminReturnSlice.reducer;
