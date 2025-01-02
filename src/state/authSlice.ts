// src/state/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

// Interface untuk tipe data user
export interface User {
  nip: string;
  nama_lengkap: string;
  email: string;
  mobile: string;
  id_role: string;
  nama_role: string;
  token: string;
  menu: string[];
  id_instansi: string;
  instansi: string;
}

// Interface untuk response login
export interface LoginResponse {
  user: User;
  token: string;
}

// Buat auth API slice
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Slice untuk menyimpan state autentikasi
interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      const {
        nip,
        nama_lengkap,
        email,
        mobile,
        nama_role,
        menu,
        token,
        id_role,
        id_instansi,
        instansi,
      } = action.payload;
      const user = {
        nip,
        nama_lengkap,
        email,
        mobile,
        nama_role,
        menu,
        token,
        id_role,
        id_instansi,
        instansi,
      };
      state.user = user;
      state.token = token;

      // Simpan ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("x-key", nip);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      // Hapus dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("x-key");
      localStorage.removeItem("user");
    },
  },
});

// Export actions dan hooks
export const { setCredentials, logout } = authSlice.actions;
export const { useLoginMutation } = authApiSlice;

export default authSlice.reducer;
