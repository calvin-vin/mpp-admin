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
}

// Interface untuk response API Setting
export interface SettingApiResponse {
  status: string;
  message: string;
  data: Setting;
}

// Slice untuk setting
export const settingSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Query untuk mendapatkan detail setting
    getSetting: build.query({
      query: () => `/konfigurasi/list`,
      providesTags: ["Setting"],
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

// Export hooks untuk digunakan di komponen
export const { useUpdateSettingMutation, useGetSettingQuery } = settingSlice;
