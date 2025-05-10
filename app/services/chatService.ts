import rtkQueryApiClient from "./rtkQueryApiClient";

export const chatSocket = new WebSocket(import.meta.env.VITE_CHAT_WSS_URL);

export const chatService = rtkQueryApiClient.injectEndpoints({
  endpoints: (builder) => ({
    syncChatSocket: builder.query<string[], void>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        if (typeof window === "undefined") {
          return;
        }

        try {
          await cacheDataLoaded;

          const listener = ({ data }: MessageEvent<string>) => {
            updateCachedData((draft) => {
              draft.push(data);
            });
          };

          setTimeout(() => {
            chatSocket.send("Hello");

            updateCachedData((draft) => {
              draft.push("Hello");
            });
          }, 1_000);

          chatSocket.addEventListener("message", listener);
        } catch (error) {
          console.error(error);
        }

        await cacheEntryRemoved;
        chatSocket.close();
      },
    }),
  }),
});

export const { useSyncChatSocketQuery } = chatService;
