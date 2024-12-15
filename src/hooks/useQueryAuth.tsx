// src/hooks/useQueryAuth.ts
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation, setCredentials } from "@/state/authSlice";
import { HOST_PORTAL } from "@/utils/constants";

export const useQueryAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  useEffect(() => {
    const processQueryAuth = async () => {
      try {
        // Ambil query parameter
        const searchParams = new URLSearchParams(window.location.search);
        const encodedQuery = searchParams.get("query");

        if (encodedQuery) {
          // Decode base64
          const decodedQuery = window.atob(encodedQuery);
          const userData = JSON.parse(decodedQuery);

          // Lakukan login
          const response = await login({
            nip: userData.nip,
            token: userData.token_auth,
          }).unwrap();

          // Simpan credentials
          dispatch(setCredentials(response.data));

          // Redirect ke halaman dashboard atau home
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Redirect ke halaman login jika gagal
        router.push(`${HOST_PORTAL}`);
      }
    };

    processQueryAuth();
  }, [login, dispatch, router]);
};
