import rtkQueryApiClient from "./rtkQueryApiClient";

const chatSocket = new WebSocket(import.meta.env.VITE_CHAT_WSS_URL);

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

          chatSocket.addEventListener("message", listener);

          setTimeout(() => {
            // console.log("What is your name?");
            chatSocket.send("What is your name?");
            // ws.dispatchEvent(new MessageEvent("message", { data: ws.url }));
          }, 5_000);
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
