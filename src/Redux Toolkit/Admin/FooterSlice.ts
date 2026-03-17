import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  Footer,
  FooterPayload,
  Page,
  PagePayload,
} from "../../types/footerTypes";

/* =========================
   Axios Base
========================= */
const api = axios.create({
  baseURL: "https://selfysnap-3.onrender.com/api/admin",
});

/* =========================
   State
========================= */
interface FooterState {
  list: Footer[];
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
}

const initialState: FooterState = {
  list: [],
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
};

/* =========================
   FOOTER THUNKS
========================= */

export const fetchFooters = createAsyncThunk<Footer[]>(
  "footer/fetch",
  async () => {
    const res = await api.get("/footer");
    return res.data.data;
  }
);

export const createFooter = createAsyncThunk<Footer, FooterPayload>(
  "footer/create",
  async (data) => {
    const res = await api.post("/footer", data);
    return res.data.data;
  }
);

export const updateFooter = createAsyncThunk<
  Footer,
  { id: string; data: Partial<FooterPayload> }
>("footer/update", async ({ id, data }) => {
  const res = await api.put(`/footer/${id}`, data);
  return res.data.data;
});

export const deleteFooter = createAsyncThunk<string, string>(
  "footer/delete",
  async (id) => {
    await api.delete(`/footer/${id}`);
    return id;
  }
);

/* =========================
   PAGE THUNKS
========================= */

export const fetchPages = createAsyncThunk<Page[]>(
  "footer/pages/fetch",
  async () => {
    const res = await api.get("/pages");
    return res.data.data;
  }
);

export const fetchPageBySlug = createAsyncThunk<Page, string>(
  "footer/pages/fetchBySlug",
  async (slug) => {
    const res = await api.get(`/pages/slug/${slug}`);
    return res.data.data;
  }
);

export const createPage = createAsyncThunk<Page, PagePayload>(
  "footer/pages/create",
  async (data) => {
    const res = await api.post("/pages", data);
    return res.data.data;
  }
);

export const updatePage = createAsyncThunk<
  Page,
  { id: string; data: Partial<PagePayload> }
>("footer/pages/update", async ({ id, data }) => {
  const res = await api.put(`/pages/${id}`, data);
  return res.data.data;
});

export const deletePage = createAsyncThunk<string, string>(
  "footer/pages/delete",
  async (id) => {
    await api.delete(`/pages/${id}`);
    return id;
  }
);

/* =========================
   SLICE
========================= */

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= FOOTER ================= */

      .addCase(fetchFooters.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createFooter.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateFooter.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteFooter.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (f) => f._id !== action.payload
        );
      })

      /* ================= PAGES ================= */

      .addCase(fetchPages.fulfilled, (state, action) => {
        state.pages = action.payload;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action) => {
        state.currentPage = action.payload;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.pages.unshift(action.payload);
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        const index = state.pages.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.pages[index] = action.payload;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.pages = state.pages.filter(
          (p) => p._id !== action.payload
        );
      })

      /* ================= GLOBAL LOADING (LAST) ================= */

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error =
            action.error?.message || "Something went wrong";
        }
      );
  },
});

export const { clearCurrentPage } = footerSlice.actions;
export default footerSlice.reducer;