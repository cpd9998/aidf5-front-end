import { Combobox } from "@/components/ComboBox";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useLazyGetHotelBySearchQuery,
  useGetRoomCategoryListByQueryQuery,
  useGetRoomCategoryByHotelQuery,
} from "../../lib/api";
import PaginationComponent from "../../components/PaginationComponent";
import { Link } from "react-router";
import { AiOutlineDelete } from "react-icons/ai";
import RoomCategoryListLoading from "../../components/LoadingTemplates/RoomCategoryListLoading";
import AlertDialogBox from "@/components/AlertDialogBox";
import { extractErrorMessage } from "../../lib/errorUtils";

const RoomCategoryList = () => {
  const [value, setValue] = useState(null);
  const [catagoryList, setCategoryList] = useState(null);
  const [roomcategories, setRoomCategories] = useState(null);

  const [triggerSearch, { data: searchByHotel, isLoading: isLoadingHotel }] =
    useLazyGetHotelBySearchQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categories,
    isLoading: isLoadingCategoryInitial,
    isError: isErrorInitialRoomCategory,
    error: roomCategoryListError,
  } = useGetRoomCategoryListByQueryQuery(currentPage);

  const shouldSkip = !value?.id;

  const queryParams = {
    hotelId: value?.id,
    page: currentPage,
  };

  const {
    data: category,
    isLoading: isLoadingCategoryByPage,
    isError: isErrorRoomCategoryByHotel,
    error: errorRoomCategoryByPage,
  } = useGetRoomCategoryByHotelQuery(queryParams, {
    skip: shouldSkip,
  });

  const handleSearch = useDebounce((searchTerm) => {
    triggerSearch(searchTerm);
  }, 500);

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  const nextPage = () => {
    setCurrentPage((prev) => {
      if (categories.pages >= currentPage) {
        return categories.pages;
      } else {
        prev + 1;
      }
    });
  };

  const previousPage = () => {
    setCurrentPage((prev) => {
      if (currentPage === 1) {
        return 1;
      } else {
        return prev - 1;
      }
    });
  };

  useEffect(() => {
    if (categories) {
      setCategoryList(categories);
    }

    if (category) {
      setCategoryList(null);
      setRoomCategories(category);
    }
  }, [searchByHotel, categories, category]);

  const isLoading =
    isLoadingHotel || isLoadingCategoryInitial || isLoadingCategoryByPage;

  const isError = isErrorInitialRoomCategory || isErrorRoomCategoryByHotel;
  const error = roomCategoryListError || errorRoomCategoryByPage;

  console.log("error", error);

  if (isLoading) {
    return <RoomCategoryListLoading />;
  }

  if (isError) {
    const errorMessage = extractErrorMessage(error);

    return <AlertDialogBox title="Unable fetch data" desc={errorMessage} />;
  }

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  "> Room Categories</h1>
        <Combobox
          list={searchByHotel}
          value={value || ""}
          setValue={setValue}
          placeholder="Search hotel..."
          handleChange={handleChange}
          // field={field}
          isLoading={isLoading}
        />

        <div className="flex flex-col justify-between gap-3 min-h-[700px]">
          <div>
            {catagoryList
              ? catagoryList?.roomCategories.map((category) => {
                  return <RoomCategory key={category._id} {...category} />;
                })
              : roomcategories &&
                roomcategories?.roomCategories.length > 0 &&
                roomcategories?.roomCategories.map((category) => {
                  return <RoomCategory key={category._id} {...category} />;
                })}
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={
              catagoryList?.totalRoomCategories ||
              roomcategories?.totalRoomCategories
            }
            perPage={2}
            setCurrentPage={setCurrentPage}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomCategoryList;

const RoomCategory = ({ _id, name, basePrice, images, description }) => {
  return (
    <Link to={`/admin/hotel/update-room-category/${_id}`}>
      <div className="w-full flex justify-between items-end max-w-[900px] mt-10 gap-5  border border-gray-200 py-3 rounded-lg px-2  ">
        <div className="flex  gap-2   ">
          <img
            className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px]     object-cover object-center  rounded-lg"
            src={images[0]}
          />

          <div className="flex flex-col   gap-2 lg:text-base text-xs pl-4  ">
            <p className="font-semibold text-gray-400">{name}</p>
            <p className=" min-h-[43px] text-gray-600   ">
              {description.slice(0, 200)} ...
            </p>
            <p>LKR {basePrice.toLocaleString()}</p>
          </div>
        </div>
        <span>
          <AiOutlineDelete className="text-3xl text-red-500 cursor-pointer" />
        </span>
      </div>
    </Link>
  );
};
