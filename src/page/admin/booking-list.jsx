import { useState, useMemo } from "react";
import { useGetBookigsByQueryQuery } from "@/lib/api";
import BookingListTable from "@/components/Admin/BookingListTable";
import PaginationComponent from "@/components/PaginationComponent";
import { Label } from "@radix-ui/react-label";

const tableHeadings = [
  "Hotel",
  "Full name",
  "Nic",
  "Check In",
  "Check Out",
  "Booking Status",
  "Payment Status",
  "Action",
];

const BookingList = () => {
  const [currentPage, setCurrentPage] = useState("1");
  const [searchBooking, setSearchBooking] = useState("");
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useGetBookigsByQueryQuery(currentPage);

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

  const handleBookingSearch = (value) => {
    setSearchBooking(value);
  };

  const filteredBookingList = useMemo(() => {
    if (!bookings?.bookigList) return [];

    const transformed = bookings?.bookigList?.map((book) => {
      const {
        _id,
        bookingNumber,
        bookingStatus,
        checkInDate,
        checkOutDate,
        guestDetails: { firstName, lastName, idNumber },
        paymentStatus,
        totalAmount,
        hotelId: { name },
      } = book;
      return {
        _id,
        hotel: name,
        fullName: firstName + " " + lastName,
        Nic: idNumber,
        checkInDate,
        checkOutDate,
        totalAmount,
        bookingStatus,
        paymentStatus,
      };
    });

    // Filter by search term
    let filtered = transformed;
    if (searchBooking) {
      const searchLower =
        typeof searchBooking === "string" && searchBooking?.toLowerCase();

      filtered = transformed.filter((book) => {
        // Convert dates to ISO string (YYYY-MM-DD format)
        const checkInStr = book.checkInDate
          ? new Date(book.checkInDate).toISOString().split("T")[0]
          : "";
        const checkOutStr = book.checkOutDate
          ? new Date(book.checkOutDate).toISOString().split("T")[0]
          : "";

        return (
          book?.hotel.toLowerCase().includes(searchLower) ||
          book?.fullName.toLowerCase().includes(searchLower) ||
          checkInStr.includes(searchLower) ||
          checkOutStr.includes(searchLower) ||
          book?.bookingStatus.toLowerCase().includes(searchLower) ||
          book?.paymentStatus.toLowerCase().includes(searchLower) ||
          book?.Nic.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [bookings, searchBooking]);

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5">List of Rooms</h1>
        <div className="w-full">
          <div className="flex gap-3 flex-col min-h-[200px]">
            <div className="flex flex-col gap-2 mb-2">
              <Label>Hotel</Label>
              <BookingListTable
                headings={tableHeadings}
                data={filteredBookingList}
                handleSearch={handleBookingSearch}
                search={searchBooking}
                isLoading={isLoading}
                isError={isError}
                error={error}
              />
              {!searchBooking && !isLoading && !isError && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={bookings?.totalBookings}
                  perPage={3}
                  setCurrentPage={setCurrentPage}
                  nextPage={nextPage}
                  previousPage={previousPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
