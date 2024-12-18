// src/state/settingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

// Interface untuk Setting
export interface Setting {
  nama_aplikasi: string;
  footer: string;
  versi: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  logo: string;
  tgl: string;
}

// Interface untuk response API Setting
export interface SettingApiResponse {
  status: string;
  message: string;
  data: Setting;
}

// Interface untuk state setting
export interface SettingState extends Setting {
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SettingState = {
  nama_aplikasi: "",
  footer: "",
  versi: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  youtube: "",
  logo: "",
  tgl: "",
  loading: false,
  error: null,
};

// API Slice untuk setting
export const settingApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Query untuk mendapatkan detail setting
    getSetting: build.query<Setting, void>({
      query: () => `/konfigurasi/list`,
      providesTags: ["Setting"],
      transformResponse: (response: SettingApiResponse) => response.data,
    }),

    // Mutation untuk update setting
    updateSetting: build.mutation({
      query: (data) => ({
        url: `/konfigurasi/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),
  }),
});

// Slice untuk state setting
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    // Set setting secara manual
    setSetting: (state, action: PayloadAction<Partial<Setting>>) => {
      const updatedSetting = {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };

      // Update state
      Object.assign(state, updatedSetting);

      // Simpan ke localStorage jika diperlukan
      localStorage.setItem("appSetting", JSON.stringify(updatedSetting));
    },

    // Set loading state
    setSettingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setSettingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset setting ke nilai awal
    resetSetting: () => {
      localStorage.removeItem("appSetting");
      return initialState;
    },
  },
  // Handle actions dari async thunk atau query
  extraReducers: (builder) => {
    builder
      .addMatcher(
        settingApiSlice.endpoints.getSetting.matchFulfilled,
        (state, action) => {
          const settingData = action.payload;
          Object.assign(state, {
            ...settingData,
            loading: false,
            error: null,
          });

          // Simpan ke localStorage
          localStorage.setItem("appSetting", JSON.stringify(settingData));
        }
      )
      .addMatcher(
        settingApiSlice.endpoints.getSetting.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Gagal mengambil pengaturan";
        }
      );
  },
});

// Selector untuk mengambil setting
export const selectSetting = (state: { setting: SettingState }) =>
  state.setting;

// Export actions
export const { setSetting, resetSetting, setSettingLoading, setSettingError } =
  settingSlice.actions;

// Export hooks dari API Slice
export const { useGetSettingQuery, useUpdateSettingMutation } = settingApiSlice;

// Export reducer
export default settingSlice.reducer;

// Async Thunk untuk fetching setting (opsional)
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSetting = createAsyncThunk(
  "setting/fetchSetting",
  async (_, { dispatch }) => {
    try {
      const settingResponse = await dispatch(
        settingApiSlice.endpoints.getSetting.initiate()
      ).unwrap();

      return settingResponse;
    } catch (error) {
      throw error;
    }
  }
);
