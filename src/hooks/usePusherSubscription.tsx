import { useEffect } from "react";
import Pusher from "pusher-js";
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from "@/utils/constants";

interface PusherSubscriptionOptions {
  channel: string;
  event: string;
  callback: (data: any) => void;
}

export const usePusherSubscription = ({
  channel,
  event,
  callback,
}: PusherSubscriptionOptions) => {
  useEffect(() => {
    let pusher: Pusher | null = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
    });

    try {
      const channelInstance = pusher.subscribe(channel);

      channelInstance.bind(event, (data: any) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in Pusher callback:", error);
        }
      });

      return () => {
        try {
          if (pusher) {
            // Cek keberadaan channel menggunakan Object.keys()
            const channels = Object.keys(pusher.channels);
            if (channels.includes(channel)) {
              pusher.unsubscribe(channel);
            }

            // Disconnect hanya jika masih terhubung
            if (pusher.connection.state === "connected") {
              pusher.disconnect();
            }

            // Set pusher ke null untuk mencegah penggunaan ulang
            pusher = null;
          }
        } catch (error) {
          console.error("Pusher cleanup error:", error);
        }
      };
    } catch (subscribeError) {
      console.error("Pusher subscription error:", subscribeError);

      // Pastikan pusher dimatikan jika terjadi kesalahan
      if (pusher) {
        pusher.disconnect();
        pusher = null;
      }

      return () => {};
    }
  }, [channel, event, callback]);
};
