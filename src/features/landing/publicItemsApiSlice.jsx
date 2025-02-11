import { apiSlice } from "../../app/api/apiSlice";

export const publicItemsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicItems: builder.query({
            query: () => ({
                url: "/settings",
                method: "GET",
            }),
            transformResponse: (responseData) =>
                responseData.map((item) => ({
                    ...item
                })),
            providesTags: [{ type: "Settings" }],
        }),
    }),
});

export const { useGetPublicItemsQuery } = publicItemsApiSlice;
