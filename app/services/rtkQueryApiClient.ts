import { axiosBaseQuery } from "../store/utils/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

const rtkQueryApiClient = createApi({
  reducerPath: "asyncDataApi",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});

export default rtkQueryApiClient;
