// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { type Payouts } from "../../types/payoutsType";
// import { api } from "../../Config/Api";

// interface PayoutsState {
//   payouts: Payouts[];
//   payout: Payouts | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: PayoutsState = {
//   payouts: [],
//   payout: null,
//   loading: false,
//   error: null,
// };

// // Thunks
// export const fetchPayoutsBySeller = createAsyncThunk<
//   Payouts[],
//   string,
//   { rejectValue: string }
// >("payouts/fetchPayoutsBySeller", async (jwt, { rejectWithValue }) => {
//   try {
//     const response = await api.get<Payouts[]>("/api/payouts/seller", {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//       },
//     });
//     console.log("Payouts ",response.data)
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       return rejectWithValue(error.response.data.message);
//     }
//     return rejectWithValue("Failed to fetch payouts");
//   }
// });

// export const fetchPayoutById = createAsyncThunk<
//   Payouts,
//   number,
//   { rejectValue: string }
// >("payouts/fetchPayoutById", async (id, { rejectWithValue }) => {
//   try {
//     const response = await api.get<Payouts>(`/api/payouts/${id}`);
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       return rejectWithValue(error.response.data.message);
//     }
//     return rejectWithValue("Failed to fetch payout");
//   }
// });

// export const updatePayoutStatus = createAsyncThunk<
//   Payouts,
//   { id: number; status: string },
//   { rejectValue: string }
// >("payouts/updatePayoutStatus", async ({ id, status }, { rejectWithValue }) => {
//   try {
//     const response = await api.put<Payouts>(
//       `/api/payouts/${id}/status`,
//       null,
//       {
//         params: { status },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       return rejectWithValue(error.response.data.message);
//     }
//     return rejectWithValue("Failed to update payout status");
//   }
// });

// // Slice
// const payoutsSlice = createSlice({
//   name: "payouts",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPayoutsBySeller.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPayoutsBySeller.fulfilled, (state, action) => {
//         state.loading = false;
//         state.payouts = action.payload;
//       })
//       .addCase(fetchPayoutsBySeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchPayoutById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPayoutById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.payout = action.payload;
//       })
//       .addCase(fetchPayoutById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       //   update payouts
//       .addCase(updatePayoutStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updatePayoutStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.payouts.findIndex(
//           (p) => p._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.payouts[index] = action.payload;
//         }
//       })
//       .addCase(updatePayoutStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default payoutsSlice.reducer;






import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { type  Payouts } from "../../types/payoutsType";

interface PayoutsState {
  payouts: Payouts[];
  payout: Payouts | null;
  loading: boolean;
  error: string | null;
}

const initialState: PayoutsState = {
  payouts: [],
  payout: null,
  loading: false,
  error: null,
};

// ✅ Seller: fetch own payouts (corrected endpoint)
export const fetchSellerPayouts = createAsyncThunk<
  Payouts[],
  string,
  { rejectValue: string }
>("payouts/fetchSellerPayouts", async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.get("/payouts/my-payout", {   // ✅ fixed: my-payouts
      headers: { Authorization: `Bearer ${jwt}` },
    });
    // If backend returns { success: true, payouts: [...] }
    return response.data.payouts ?? response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch payouts");
  }
});

// ✅ Admin: pending requests (optional: adjust if needed)
export const fetchPendingPayouts = createAsyncThunk<
  Payouts[],
  string,
  { rejectValue: string }
>("payouts/fetchPendingPayouts", async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.get("/payouts/admin/pending", {   // assuming /payouts prefix
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data.payouts ?? response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch pending");
  }
});

// ✅ Admin: history
export const fetchPayoutHistory = createAsyncThunk<
  Payouts[],
  string,
  { rejectValue: string }
>("payouts/fetchPayoutHistory", async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.get("/payouts/admin/history", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data.payouts ?? response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch history");
  }
});

// ✅ Admin: update status (approve/reject) – uses /payouts/... if backend expects that
export const updatePayoutStatus = createAsyncThunk<
  Payouts,
  { id: string; status: string; jwt: string },
  { rejectValue: string }
>("payouts/updatePayoutStatus", async ({ id, status, jwt }, { rejectWithValue }) => {
  try {
    const response = await api.put(
      `/payouts/${id}/status?status=${status}`,   // changed from /payout/ to /payouts/
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    return response.data.payout ?? response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

const payoutsSlice = createSlice({
  name: "payouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerPayouts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSellerPayouts.fulfilled, (state, action) => { state.loading = false; state.payouts = action.payload; })
      .addCase(fetchSellerPayouts.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchPendingPayouts.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingPayouts.fulfilled, (state, action) => { state.loading = false; state.payouts = action.payload; })
      .addCase(fetchPendingPayouts.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchPayoutHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchPayoutHistory.fulfilled, (state, action) => { state.loading = false; state.payouts = action.payload; })
      .addCase(fetchPayoutHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updatePayoutStatus.pending, (state) => { state.loading = true; })
      .addCase(updatePayoutStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payouts.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.payouts[index] = action.payload;
      })
      .addCase(updatePayoutStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default payoutsSlice.reducer;





