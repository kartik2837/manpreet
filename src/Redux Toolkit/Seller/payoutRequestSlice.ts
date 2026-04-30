// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { api } from "../../Config/Api";
// import { type Payouts } from "../../types/payoutsType";

// export const requestPayout = createAsyncThunk<
//   Payouts,
//   string,
//   { rejectValue: string }
// >("payouts/requestPayout", async (jwt, { rejectWithValue }) => {
//   try {
//     const response = await api.post<Payouts>("/api/payouts/request", {}, {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       return rejectWithValue(error.response.data.message);
//     }
//     return rejectWithValue("Failed to request payout");
//   }
// });

// const payoutRequestSlice = createSlice({
//   name: "payoutRequest",
//   initialState: { loading: false, error: null as string | null, success: false },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(requestPayout.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(requestPayout.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(requestPayout.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.success = false;
//       });
//   },
// });

// export default payoutRequestSlice.reducer;





















import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { type Payouts } from "../../types/payoutsType";

interface PayoutRequestState {
  loading: boolean;
  error: string | null;
  success: boolean;
  lastPayout: Payouts | null;
}

const initialState: PayoutRequestState = {
  loading: false,
  error: null,
  success: false,
  lastPayout: null,
};

export const requestPayout = createAsyncThunk<
  { payout: Payouts; message: string },
  { jwt: string; amount: number },
  { rejectValue: string }
>("payoutRequest/request", async ({ jwt, amount }, { rejectWithValue }) => {
  try {
    const response = await api.post<{ success: boolean; message: string; payout: Payouts }>(
      "/payouts/request",
      { amount },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to request payout");
  }
});

const payoutRequestSlice = createSlice({
  name: "payoutRequest",
  initialState,
  reducers: {
    clearRequestState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.lastPayout = action.payload.payout;
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearRequestState } = payoutRequestSlice.actions;
export default payoutRequestSlice.reducer;
