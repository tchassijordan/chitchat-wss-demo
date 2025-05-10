import { configureStore } from "@reduxjs/toolkit";
import rtkQueryApiClient from "../services/rtkQueryApiClient";

const store = configureStore({
  reducer: {
    [rtkQueryApiClient.reducerPath]: rtkQueryApiClient.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryApiClient.middleware),
});

export default store;
