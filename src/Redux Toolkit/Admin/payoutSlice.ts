// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../../Config/Api";

// // ================= TYPES =================
// export interface Payouts {
//   _id: string;
//   amount: number;
//   commission: number;
//   status: string;
//   seller: any;
// }

// export interface SellerSummary {
//   sellerId: string;
//   sellerName: string;
//   total: number;
//   weekly: number;
//   monthly: number;
// }

// interface AdminPayoutsState {
//   payouts: Payouts[];
//   summary: SellerSummary[];
//   loading: boolean;
//   error: string | null;
// }

// // ================= INITIAL STATE =================
// const initialState: AdminPayoutsState = {
//   payouts: [],
//   summary: [],
//   loading: false,
//   error: null,
// };

// // ================= THUNKS =================
// export const fetchAdminPayouts = createAsyncThunk(
//   "adminPayouts/fetchAdminPayouts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/api/payouts/admin");
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch payouts"
//       );
//     }
//   }
// );

// export const fetchPayoutSummary = createAsyncThunk(
//   "adminPayouts/fetchPayoutSummary",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/api/payouts/summary");
//       return res.data; // response object with summary
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch summary"
//       );
//     }
//   }
// );

// export const updatePayoutStatus = createAsyncThunk(
//   "adminPayouts/updatePayoutStatus",
//   async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
//     try {
//       const res = await api.put(`/api/payouts/${id}/status`, null, { params: { status } });
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update status"
//       );
//     }
//   }
// );

// // ================= SLICE =================
// const adminPayoutSlice = createSlice({
//   name: "adminPayouts",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // ===== fetch payouts =====
//     builder.addCase(fetchAdminPayouts.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(fetchAdminPayouts.fulfilled, (state, action) => {
//       state.loading = false;
//       state.payouts = Array.isArray(action.payload) ? action.payload : [];
//     });
//     builder.addCase(fetchAdminPayouts.rejected, (state, action: any) => {
//       state.loading = false;
//       state.error = action.payload;
//     });

//     // ===== fetch summary =====
//     builder.addCase(fetchPayoutSummary.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(fetchPayoutSummary.fulfilled, (state, action) => {
//       state.loading = false;

//       const sellerSummaryArray =
//         action.payload?.summary?.sellerSummary && Array.isArray(action.payload.summary.sellerSummary)
//           ? action.payload.summary.sellerSummary
//           : [];

//       const weekly = action.payload?.summary?.weekly || 0;
//       const monthly = action.payload?.summary?.monthly || 0;

//       state.summary = sellerSummaryArray.map((item: any) => ({
//         sellerId: item.seller?._id || item._id,
//         sellerName: item.seller?.sellerName || "Unknown",
//         total: item.totalOrders || 0,
//         weekly,
//         monthly,
//       }));
//     });
//     builder.addCase(fetchPayoutSummary.rejected, (state, action: any) => {
//       state.loading = false;
//       state.error = action.payload;
//     });

//     // ===== update payout status =====
//     builder.addCase(updatePayoutStatus.fulfilled, (state, action) => {
//       const index = state.payouts.findIndex((p) => p._id === action.payload._id);
//       if (index !== -1) {
//         state.payouts[index] = action.payload;
//       }
//     });
//   },
// });

// export default adminPayoutSlice.reducer;











import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

// ================= TYPES =================
export interface Payouts {
  _id: string;
  amount: number;
  commissionAmount: number;
  status: "PENDING" | "SUCCESS" | "REJECTED";
  seller: any;
  createdAt: string;
  paidAt?: string | null;
}

export interface SellerSummary {
  sellerId: string;
  sellerName: string;
  total: number;
  weekly: number;
  monthly: number;
}

interface AdminPayoutsState {
  pending: Payouts[];
  history: Payouts[];
  summary: SellerSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminPayoutsState = {
  pending: [],
  history: [],
  summary: [],
  loading: false,
  error: null,
};

// ================= THUNKS =================

// Fetch pending payouts (status = "PENDING")
export const fetchPendingPayouts = createAsyncThunk(
  "adminPayouts/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/payouts/admin/pending", {   // ✅ changed to /payouts/...
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      return res.data.payouts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch pending payouts");
    }
  }
);

// Fetch payout history
export const fetchPayoutHistory = createAsyncThunk(
  "adminPayouts/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/payouts/admin/history", {   // ✅ changed
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      return res.data.payouts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch history");
    }
  }
);

// Fetch seller earnings summary
export const fetchPayoutSummary = createAsyncThunk(
  "adminPayouts/fetchPayoutSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/payouts/summary", {   // ✅ changed
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      return res.data.summary.sellerSummary;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch summary");
    }
  }
);

// Update payout status (approve/reject)
export const updatePayoutStatus = createAsyncThunk(
  "adminPayouts/updatePayoutStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/payouts/${id}/status?status=${status}`,   // ✅ changed
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      return res.data.payout;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

// ================= SLICE =================
const adminPayoutSlice = createSlice({
  name: "adminPayouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Pending
      .addCase(fetchPendingPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPendingPayouts.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch History
      .addCase(fetchPayoutHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayoutHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPayoutHistory.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Summary
      .addCase(fetchPayoutSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayoutSummary.fulfilled, (state, action) => {
        state.loading = false;
        const summaryArray = Array.isArray(action.payload) ? action.payload : [];
        state.summary = summaryArray.map((item: any) => ({
          sellerId: item.sellerId || item._id,
          sellerName: item.sellerName || "Unknown",
          total: item.total || 0,
          weekly: item.weekly || 0,
          monthly: item.monthly || 0,
        }));
      })
      .addCase(fetchPayoutSummary.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updatePayoutStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated.status !== "PENDING") {
          state.pending = state.pending.filter(p => p._id !== updated._id);
          const exists = state.history.some(h => h._id === updated._id);
          if (!exists) state.history.unshift(updated);
          else {
            const index = state.history.findIndex(h => h._id === updated._id);
            if (index !== -1) state.history[index] = updated;
          }
        } else {
          state.pending = [updated, ...state.pending.filter(p => p._id !== updated._id)];
        }
      });
  },
});

export default adminPayoutSlice.reducer;
