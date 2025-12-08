import { useState, useEffect, useMemo, useCallback } from "react";
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
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [rooms, setRooms] = useState([]);

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
      pageNumber: currentPage,
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

  // Reset category and rooms when hotel changes
  useEffect(() => {
    if (hotel?.id) {
      setCategory(null);
      setCategoryList([]);
      setRooms(null);
      setSeachRoom("");
      setCurrentPage("1");
    }
  }, [hotel?.id]);

  // Reset rooms when category changes
  useEffect(() => {
    if (category?.id) {
      setRooms(null);
      setCurrentPage("1");
    }
  }, [category?.id]);

  useEffect(() => {
    if (searchResults) {
      setHotelList(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    if (categories) {
      const newCategories = categories?.roomCategories.map((cate) => {
        return {
          label: cate.name.trim(),
          value: cate.name.trim(),
          id: cate._id,
        };
      });
      setCategoryList(newCategories);
    }
  }, [categories]);

  useEffect(() => {
    if (roomsList) {
      setRooms(roomsList);
    }
  }, [roomsList]);

  const nextPage = () => {
    setCurrentPage((prev) => {
      const prevNum = parseInt(prev);
      if (prevNum >= roomsList?.totalPages) {
        return roomsList.totalPages.toString();
      }
      return (prevNum + 1).toString();
    });
  };

  const previousPage = () => {
    setCurrentPage((prev) => {
      const prevNum = parseInt(prev);
      if (prevNum <= 1) {
        return "1";
      }
      return (prevNum - 1).toString();
    });
  };

  const handleRoomSearch = (value) => {
    setSeachRoom(value);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 ml-1" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const filteredRoomList = useMemo(() => {
    if (!roomsList?.newRooms) return [];

    const transformed = roomsList?.newRooms?.map((room) => {
      const { _id: id, floor, hotel, category, roomNumber, status } = room;
      return {
        id,
        floor,
        hotel: hotel.name,
        category: category.name,
        roomNo: roomNumber,
        status,
      };
    });

    // Filter by search term
    let filtered = transformed;
    if (searchRoom) {
      const searchLower = searchRoom?.toLowerCase();
      filtered = transformed.filter(
        (room) =>
          room.roomNo.toString().toLowerCase().includes(searchLower) ||
          room.floor.toString().includes(searchLower) ||
          room.status.toLowerCase().includes(searchLower)
      );
    }

    // Sort the filtered results
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle numeric sorting for roomNo and floor
        if (sortConfig.key === "roomNo" || sortConfig.key === "floor") {
          const aNum = Number(aValue);
          const bNum = Number(bValue);
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Handle string sorting
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [roomsList, searchRoom, sortConfig]);

  const statusColors = {
    Available: "text-green-500",
    Occupied: "text-red-500",
    Maintenance: "text-orange-500",
    Cleaning: "text-violet-500",
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5">List of Rooms</h1>
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
                disabled={!categories}
                list={categoryList || []}
                value={category || ""}
                setValue={setCategory}
                placeholder="Search Category..."
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>

        {rooms && rooms?.newRooms?.length > 0 ? (
          <div className="">
            <TableComponent
              headings={tableHeadings}
              data={filteredRoomList}
              properties={statusColors}
              handleSearch={handleRoomSearch}
              search={searchRoom}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
            />
            {!searchRoom && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={roomsList?.totalPages}
                perPage={3}
                setCurrentPage={setCurrentPage}
                nextPage={nextPage}
                previousPage={previousPage}
              />
            )}
          </div>
        ) : (
          <div className="text-center font-light text-gray-400">
            No rooms available
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
