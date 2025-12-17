import { addDays, format } from "date-fns";
import { useParams } from "react-router";
import { GrLocation } from "react-icons/gr";
import { CiStar } from "react-icons/ci";
import { TiStarFullOutline } from "react-icons/ti";
import { IoIosWifi } from "react-icons/io";
import { IoMenuSharp } from "react-icons/io5";
import { IoTvOutline } from "react-icons/io5";
import { FiCoffee } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetHotelByIdQuery,
  useLazyGetAvailabilityQuery,
} from "@/lib/api.js";
import AvailabilitySearch from "@/components/AvailabilitySearch";
import { useState, useEffect } from "react";
import AvailabilityList from "@/components/AvailabilityList";
import Loading from "@/components/Loading";
import { Spinner } from "@/components/ui/spinner";
import AlertDialogBox from "@/components/AlertDialogBox";
import { extractErrorMessage } from "@/lib/errorUtils";

const Hotel = () => {
  const { _id } = useParams();
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkout, setCheckOut] = useState(addDays(new Date(), 2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [open, setOpen] = useState(false);

  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError: isErrorHotel,
    error: errorHotel,
  } = useGetHotelByIdQuery(_id);

  const params = {
    hotelId: _id,
    checkInDate: format(checkIn, "yyyy-MM-dd"),
    checkOutDate: format(checkout, "yyyy-MM-dd"),
    maxAdults: Number(adults),
    maxChildren: Number(children),
  };

  const [
    triggerSearch,
    {
      data: availabilityList,
      isLoading: isAvailabilityLoading,
      isError: isErrorAvailability,
      error: errorAvailabiliy,
    },
  ] = useLazyGetAvailabilityQuery(params);

  useEffect(() => {
    triggerSearch(params);
  }, [_id]);

  const handleReview = async () => {
    try {
      await addReview({
        hotelId: _id,
        comment: "Great stay!",
        rating: 5,
      }).unwrap();
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  const handleCheckAvailability = () => {
    if (params) {
      triggerSearch(params);
    }
  };
  const isLoading = isHotelLoading || isAvailabilityLoading;

  if (isLoading) {
    return (
      <div className="mt-6 border-t border-gray-200">
        <div className=" max-w-[1440px]  mx-auto h-screen ">
          <div className="flex flex-col lg:flex-row gap-4  px-4 mt-10 pb-5  ">
            {/*HOTEL IMAGE*/}
            <div className="relative   ">
              <Skeleton className="h-[460px] bg-gray-300  w-[700px] rounded-lg" />
            </div>

            {/*HOTEL DETAILS*/}
            <div className="flex flex-col max-w-[700px]">
              <Skeleton className="text-2xl font-bold h-5 w-[250px] bg-gray-300 rounded-lg" />
              <div className="flex items-center gap-2 mt-2 mb-4">
                <Skeleton className="text-2xl font-bold h-5 w-[200px] bg-gray-300 rounded-lg" />
              </div>

              <div className="flex items-center space-x-1 mb-5">
                <Skeleton className="text-2xl font-bold h-5 w-[100px] bg-gray-300 rounded-lg" />
              </div>

              <Skeleton className="text-2xl font-bold h-5 w-[700px] h-[96px] bg-gray-300 rounded-lg" />

              <div className=" mt-5 ">
                <Skeleton className="text-2xl font-bold h-5 w-[700px] h-[134px] bg-gray-300 rounded-lg" />
              </div>

              <div className="flex flex-col gap-6 lg:flex-row justify-between mt-6">
                <div className=" ">
                  <Skeleton className="text-2xl font-bold h-5 w-[64px] h-[32px] bg-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-gray-200">
      <div className=" max-w-[1440px]  mx-auto h-screen ">
        {!isErrorHotel ? (
          <div className="flex flex-col lg:flex-row gap-4  px-4 mt-10 pb-5  ">
            {/*HOTEL IMAGE*/}

            <div className="relative   ">
              <img
                src={hotel?.image}
                className="object-contain md:object-cover  h-auto rounded-md"
              />

              <div className="flex gap-2 mt-4 ">
                <span className="bg-gray-100  p-2 rounded-xl capitalize text-sm  font-semibold ">
                  rooftop view
                </span>
                <span className="bg-gray-100  p-2 rounded-xl capitalize text-sm font-semibold">
                  french cusine
                </span>
                <span className="bg-gray-100  p-2 rounded-xl capitalize text-sm font-semibold">
                  city center
                </span>
              </div>
            </div>

            {/*HOTEL DETAILS*/}
            <div className="flex flex-col max-w-[700px]">
              <h1 className="text-2xl font-bold ">{hotel?.name}</h1>
              <div className="flex items-center gap-2 mt-2 mb-4">
                <GrLocation className="text-gray-500" />
                <p className="text-gray-500 font-light capitalize ">
                  {hotel?.city}
                </p>
              </div>

              <button className="border border-gray-200   rounded-md w-10 h-10 flex items-center justify-center mb-4">
                <CiStar />
              </button>

              <div className="flex items-center space-x-1 mb-5">
                <TiStarFullOutline />
                <span>{hotel?.rating}</span>
                <span className="text-gray-500 font-light ">
                  ({hotel?.review.length?.toLocaleString() ?? "No Reviews"}{" "}
                  reviews)
                </span>
              </div>

              <p className="text-gray-500 font-light ">{hotel?.desc}</p>

              <div className="border border-gray-200 rounded-md shadow-md mt-5 p-3">
                <h2 className="mt-2">Amenities</h2>
                <div className="grid grid-cols-2 mt-3  gap-4">
                  <div className="flex gap-2 items-center">
                    <IoIosWifi />
                    <span>Free Wi-Fi</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <IoMenuSharp />
                    <span>Restaurant</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <IoTvOutline />
                    <span>Flat-screen TV</span>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <FiCoffee />
                    <span>Coffee maker</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row justify-between mt-6">
                <div className=" ">
                  <p className="text-xl font-bold">
                    ${hotel?.price?.toLocaleString()}
                  </p>
                  <p className="text-gray-500 font-light">per night</p>
                </div>
                <button
                  className="bg-blue-500 h-10 px-2  text-white text-center  rounded-md capitalize  hover:bg-blue-700 "
                  onClick={handleReview}
                >
                  Add Review
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <AlertDialogBox message={extractErrorMessage(errorHotel)} />
          </div>
        )}
        <div>
          <AvailabilitySearch
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkout={checkout}
            setCheckOut={setCheckOut}
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
            handleCheckAvailability={handleCheckAvailability}
            isLoading={isAvailabilityLoading}
          />
          {!isLoading &&
          !isErrorAvailability &&
          availabilityList?.categories.length > 0 ? (
            <AvailabilityList
              availabilityList={{
                categories: availabilityList.categories,
                searchParams: { ...params },
              }}
            />
          ) : isLoading ? (
            <Spinner />
          ) : isErrorAvailability ? (
            <div className="mt-5">
              <AlertDialogBox message={extractErrorMessage(errorAvailabiliy)} />
            </div>
          ) : (
            <div className="mt-5 pl-2">
              No availability rooms for selected days
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Hotel;
