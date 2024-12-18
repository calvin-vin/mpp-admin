// src/hooks/useQueryAuth.ts
import { setCredentials, useLoginMutation } from "@/state/authSlice";
import { setSetting } from "@/state/settingSlice"; // Gunakan hook dari RTK Query
import { BASE_API_URL, HOST_PORTAL } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export const useQueryAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  useEffect(() => {
    const processQueryAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const encodedQuery = searchParams.get("query");

        if (encodedQuery) {
          const decodedQuery = window.atob(encodedQuery);
          const userData = JSON.parse(decodedQuery);

          const response = await login({
            nip: userData.nip,
            token: userData.token_auth,
          }).unwrap();

          dispatch(setCredentials(response.data));

          const settingResponse = await axios.get(
            `${BASE_API_URL}/v1/konfigurasi/list`,
            {
              headers: {
                "X-key": userData.nip,
                token: userData.token_auth,
              },
            }
          );

          dispatch(setSetting(settingResponse.data.data));
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push(`${HOST_PORTAL}`);
      }
    };

    processQueryAuth();
  }, [login, dispatch, router]);
};
