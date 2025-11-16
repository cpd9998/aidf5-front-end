import HotelList from "./HotelList";
import HotelLoading from "../LoadingTemplates/HotelLoading";
import LocationTab from "@/components/Home/LocationTab.jsx";
import {
  useAddLocationMutation,
  useGetAllHotelsQuery,
  useGetAllLocationsQuery,
} from "../../lib/api.js";
import { useState } from "react";

const TrendingHotels = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const {
    data: hotels,
    isLoading: isHotelLoading,
    isError: isHotelError,
    error: hotelError,
  } = useGetAllHotelsQuery();
  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationError,
    error: locationError,
  } = useGetAllLocationsQuery();
  const [
    addLocation,
    {
      isLoading: isAddlocationLoading,
      isError: isAddlocationError,
      error: addLocationError,
    },
  ] = useAddLocationMutation();

  console.log(locations, "locations");

  const isLoading =
    isHotelLoading || isLocationsLoading || isAddlocationLoading;
  const isError = isHotelError || isLocationError || isAddlocationError;
  const error =
    hotelError?.error || locationError?.error || addLocationError?.error;

  const allLocations = locations ? [{ _id: 0, name: "all" }, ...locations] : [];

  const filtredHotels =
    selectedCountry === "all"
      ? hotels
      : hotels.filter(
          (hotel) =>
            hotel.country.toLowerCase().trim() ===
            selectedCountry?.toLowerCase().trim()
        );

  console.log("filterd ", filtredHotels);

  if (isLoading) {
    return (
      <section className="px-8 mt-20">
        <h1 className="text-black text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h1>
        <p className="text-gray-500 text-lg font-extralight ">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
        <LocationTab
          locations={allLocations}
          setSelectedCountry={setSelectedCountry}
          selectedCountry={selectedCountry}
        />

        <div className="  grid lg:grid-cols-4 md:grid-cols-2 gap-3 ">
          <HotelLoading />
          <HotelLoading />
          <HotelLoading />
          <HotelLoading />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 mt-20">
        <h1 className="text-black text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h1>
        <p className="text-gray-500 text-lg font-extralight ">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>

        <p className=" mt-10 text-red-500">Something went wrong</p>
      </section>
    );
  }

  return (
    <section className="px-8 mt-20">
      <h1 className="text-black text-4xl font-bold mb-4">
        Top trending hotels worldwide
      </h1>
      <p className="text-gray-500 text-lg font-extralight ">
        Discover the most trending hotels worldwide for an unforgettable
        experience.
      </p>

      <LocationTab
        locations={allLocations}
        setSelectedCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
      />

      <HotelList hotels={filtredHotels} />
    </section>
  );
};

export default TrendingHotels;
