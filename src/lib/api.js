import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
    prepareHeaders: async (headers) => {
      const clerk = window.Clerk;
      if (clerk) {
        const token = await clerk.session.getToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
    },
  }),
  tagTypes: ["Hotel", "Location", "Category", "Room"],
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: () => "hotels",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Hotel", _id })),
              { type: "Hotel", id: "LIST" },
            ]
          : [{ type: "Hotel", id: "LIST" }],
    }),

    getAllHotelsByPagination: build.query({
      query: (page = 1) => `/pagination/hotels?pageNumber=${page}`,
      providesTags: (result) =>
        result?.hotel
          ? [
              ...result.map(({ _id }) => ({ type: "Hotel", _id })),
              { type: "Hotel", id: "LIST" },
            ]
          : [{ type: "Hotel", id: "LIST" }],
    }),

    getHotelsBySearch: build.query({
      query: (query) => `/ai/search?query=${query}`,
      providesTags: (result, error, query) => [{ type: "Hotel", id: query }], // Use the actual query parameter
    }),

    getAllLocations: build.query({
      query: () => "location",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Location", _id })),
              { type: "Location", id: "LIST" },
            ]
          : [{ type: "Location", id: "LIST" }],
    }),

    addHotel: build.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
      invalidatesTags: [{ type: "Hotel", id: "LIST" }],
    }),

    addCategory: build.mutation({
      query: (hotel) => ({
        url: "/hotels/room-category",
        method: "POST",
        body: hotel,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    addRoom: build.mutation({
      query: (room) => ({
        url: "/hotels/room",
        method: "POST",
        body: room,
      }),
      invalidatesTags: [{ type: "Room", id: "LIST" }],
    }),

    updateHotel: build.mutation({
      query: ({ hotel, id }) => ({
        url: `/hotels/${id}`,
        method: "PUT",
        body: hotel,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Hotel", id: "LIST" },
        { type: "Hotel", id },
      ],
    }),

    updateHRoomCategory: build.mutation({
      query: ({ hotel, id }) => ({
        url: `/hotels/room-category/${id}`,
        method: "PUT",
        body: hotel,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id: "LIST" },
        { type: "Category", id },
      ],
    }),

    updateRoom: build.mutation({
      query: ({ room, id }) => ({
        url: `/hotels/room/${id}`,
        method: "PUT",
        body: room,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Room", id: "LIST" },
        { type: "Room", id },
      ],
    }),

    addLocation: build.mutation({
      query: (location) => ({
        url: "location",
        method: "POST",
        body: {
          name: location.name,
        },
      }),

      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),

    getHotelById: build.query({
      query: (id) => `/hotels/${id}`,
      providesTags: (result, error, id) => [{ type: "Hotel", id }],
    }),
    getRoomById: build.query({
      query: (id) => `/hotels/room/${id}`,
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),

    getHotelBySearch: build.query({
      query: (query) => `/hotels/search?name=${query}`,
      providesTags: (result, error, id) => [{ type: "Hotel", id }],
    }),

    getRoomCategoryListByQuery: build.query({
      query: (query) => `/pagination/room-category?pageNumber=${query}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    getRoomCategoryById: build.query({
      query: (id) => `/hotels/room-category/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    getRoomCategoryByHotel: build.query({
      query: (args) =>
        `/pagination/room-category/${args.hotelId} ${!args.page && ""}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    getRoomsByQuery: build.query({
      query: (args) =>
        `/pagination/room?hotelId=${args.hotelId}&categoryId=${args.categoryId}&pageNumber=${args.pageNumber}`,
      providesTags: (result) =>
        result?.newRooms
          ? [
              ...result.newRooms.map(({ _id }) => ({ type: "Room", _id })),
              { type: "Room", id: "LIST" },
            ]
          : [{ type: "Room", id: "LIST" }],
    }),

    addReview: build.mutation({
      query: (review) => ({
        url: "reviews",
        method: "POST",
        body: review,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllHotelsQuery,
  useGetAllLocationsQuery,
  useGetHotelsBySearchQuery,
  useGetAllHotelsByPaginationQuery,
  useGetHotelByIdQuery,
  useAddLocationMutation,
  useAddReviewMutation,
  useAddHotelMutation,
  useUpdateHotelMutation,
  useGetHotelBySearchQuery,
  useLazyGetHotelBySearchQuery,
  useAddCategoryMutation,
  useGetRoomCategoryListByQueryQuery,
  useGetRoomCategoryByIdQuery,
  useGetRoomCategoryByHotelQuery,
  useUpdateHRoomCategoryMutation,
  useAddRoomMutation,
  useGetRoomQuery,
  useGetRoomsByQueryQuery,
  useUpdateRoomMutation,
  useGetRoomByIdQuery,
} = api;
