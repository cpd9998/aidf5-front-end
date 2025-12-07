import { useState, useEffect, useMemo } from "react";
import { Combobox } from "@/components/ComboBox";
import {
  useGetRoomCategoryByHotelQuery,
  useLazyGetHotelBySearchQuery,
  useGetRoomsByQueryQuery,
} from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@radix-ui/react-label";
import TableComponent from "@/components/TableComponent";
import PaginationComponent from "@/components/PaginationComponent";

const tableHeadings = [
  "Id",
  "Hotel",
  "Category",
  "Room No",
  "Floor",
  "Status",
  "Actions",
];

const RoomList = () => {
  const [hotelList, setHotelList] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState("1");
  const [searchRoom, setSeachRoom] = useState("");

  const [
    triggerSearch,
    {
      data: searchResults,
      isLoading: isLoadingHotel,
      isError: isHotelError,
      error: hotelError,
    },
  ] = useLazyGetHotelBySearchQuery();

  const {
    data: categories,
    isError: isCategoryError,
    error: categoryError,
  } = useGetRoomCategoryByHotelQuery(
    {
      hotelId: hotel?.id,
    },
    {
      skip: !hotel?.id,
    }
  );

  const { data: roomsList } = useGetRoomsByQueryQuery(
    {
      hotelId: hotel?.id,
      categoryId: category?.id,
      pageNumber: currentPage,
    },
    {
      skip: !hotel?.id || !category?.id || !currentPage,
    }
  );

  const handleSearch = useDebounce((searchTerm) => {
    triggerSearch(searchTerm);
  }, 500);

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  useEffect(() => {
    if (searchResults) {
      setHotelList(searchResults);
    }
    if (categories) {
      const newCategories = categories?.roomCategories.map((cate) => {
        return { label: cate.name, value: cate.name, id: cate._id };
      });
      setCategoryList(newCategories);
    }

    if (roomsList) {
    }
  }, [searchResults, categories, roomsList]);

  const nextPage = () => {
    setCurrentPage((prev) => {
      if (roomsList.totalPages >= currentPage) {
        return roomsList.totalPages;
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

  const handleRoomSearch = (value) => {
    setSeachRoom(value);
  };

  //   const newRoomList = roomsList?.newRooms?.map((room) => {
  //     const { _id: id, floor, hotel, category, room: roomNo, status } = room;
  //     return {
  //       id,
  //       floor,
  //       hotel: hotel.name,
  //       category: category.name,
  //       roomNo: roomNo,
  //       status,
  //     };
  //   });

  const filteredRoomList = useMemo(() => {
    if (!roomsList?.newRooms) return [];

    const transformed = roomsList?.newRooms?.map((room) => {
      const { _id: id, floor, hotel, category, room: roomNo, status } = room;
      return {
        id,
        floor,
        hotel: hotel.name,
        category: category.name,
        roomNo: roomNo,
        status,
      };
    });

    // Filter by search term
    if (!searchRoom) return transformed;

    const searchLower = searchRoom?.toLowerCase();
    return transformed.filter(
      (room) =>
        room.roomNo.toString().toLowerCase().includes(searchLower) ||
        room.floor.toString().includes(searchLower) ||
        room.status.toLowerCase().includes(searchLower)
    );
  }, [roomsList, searchRoom]);

  const statusColors = {
    Available: "text-green-500",
    Occupied: "text-red-500",
    Maintenance: "text-orange-500",
    Cleaning: "text-violet-500",
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  ">List of Rooms</h1>
        <div className="lg:w-1/2 w-full">
          <div className="flex gap-3 flex-col min-h-[200px]">
            <div className="flex flex-col gap-2 mb-2">
              <Label>Hotel</Label>
              <Combobox
                list={hotelList || []}
                value={hotel || ""}
                setValue={setHotel}
                placeholder="Search hotels..."
                handleChange={handleChange}
                isLoading={isLoadingHotel}
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <Label>Room Category</Label>
              <Combobox
                disabled={categories ? false : true}
                list={categoryList || []}
                value={category || ""}
                setValue={setCategory}
                placeholder="Search Category..."
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="">
          <TableComponent
            headings={tableHeadings}
            data={filteredRoomList}
            properties={statusColors}
            handleSearch={handleRoomSearch}
            search={searchRoom}
          />
          {!searchRoom && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={roomsList?.totalRooms}
              perPage={3}
              setCurrentPage={setCurrentPage}
              nextPage={nextPage}
              previousPage={previousPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
