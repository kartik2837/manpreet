import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

/* ================= TYPES ================= */

export interface Address {
  _id?: string;
  name: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

/* ================= INITIAL STATE ================= */

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

const DEPLOYED_URL = "/api/address";

/* ================= HELPER ================= */

const normalizeAddress = (item: any): Address => ({
  ...item,
  _id: String(item._id),
});

/* ================= ASYNC THUNKS ================= */

// Fetch Addresses
export const fetchAddresses = createAsyncThunk<
  Address[],
  string,
  { rejectValue: string }
>("address/fetch", async (jwt, { rejectWithValue }) => {
  try {
    const res = await api.get(DEPLOYED_URL, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    return res.data.map(normalizeAddress);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Fetch failed");
  }
});

// Create Address
export const createAddress = createAsyncThunk<
  Address,
  { data: Address; jwt: string },
  { rejectValue: string }
>("address/create", async ({ data, jwt }, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.post(DEPLOYED_URL, data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch(fetchAddresses(jwt));
    return normalizeAddress(res.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Create failed");
  }
});

// Update Address
export const updateAddress = createAsyncThunk<
  Address,
  { id: string; data: Address; jwt: string },
  { rejectValue: string }
>("address/update", async ({ id, data, jwt }, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.put(`${DEPLOYED_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch(fetchAddresses(jwt));
    return normalizeAddress(res.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Update failed");
  }
});

// Delete Address
export const deleteAddress = createAsyncThunk<
  string,
  { id: string; jwt: string },
  { rejectValue: string }
>("address/delete", async ({ id, jwt }, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`${DEPLOYED_URL}/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch(fetchAddresses(jwt));
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Delete failed");
  }
});

/* ================= SLICE ================= */

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })

      // Create
      .addCase(createAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.addresses.unshift(action.payload);
      })

      // Update
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        const index = state.addresses.findIndex(a => a._id === action.payload._id);
        if (index !== -1) state.addresses[index] = action.payload;
      })

      // Delete
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.addresses = state.addresses.filter(a => a._id !== action.payload);
      });
  },
});

export default addressSlice.reducer;
