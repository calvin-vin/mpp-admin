import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { API_HOST } from "@/utils/constants";
import { getHeaders } from "@/utils/helpers";

export const customBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: API_HOST,
    prepareHeaders: (headers, { getState }) => {
      const headersData = getHeaders();

      // Hanya set header jika nilai tidak kosong
      // if (headersData["X-Key"]) {
      //   headers.set("X-Key", headersData["X-Key"]);
      // }

      // if (headersData["Token"]) {
      //   headers.set("Token", headersData["Token"]);
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
