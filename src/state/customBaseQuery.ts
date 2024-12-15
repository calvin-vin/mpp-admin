// src/state/customBaseQuery.ts
import { API_HOST } from "@/utils/constants";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

interface User {
  nip: string;
}

export const customBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: API_HOST,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (token) {
        headers.set("Token", token);
      }

      if (userString) {
        try {
          // Parse string JSON menjadi objek
          const user: User = JSON.parse(userString);

          // Gunakan nip dari objek user
          if (user.nip) {
            headers.set("X-key", user.nip);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      return headers;
    },
  });
};
