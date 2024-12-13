import { API_HOST } from "@/utils/constants";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const customBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: API_HOST,
    prepareHeaders: (headers, { getState }) => {
      // Tambahkan token dari localStorage jika ada
      // const token = localStorage.getItem("token");
      // const nip = localStorage.getItem("x-key");
      // if (token) {
      //   headers.set("Token", token);
      // }

      // if (nip) {
      //   headers.set("X-key", nip);
      // }

      headers.set("X-Key", "999999999");
      headers.set(
        "Token",
        "bWkDHQLFtWlGy77KeS0qqq7i6pwdhpCgGhHtrggARhIS6aNyfyviLwkUTsR1v7Jo"
      );

      return headers;
    },
  });
};
