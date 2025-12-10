import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DialogComponent } from "@/components/DialogComponent";
import Booking from "./Booking";
import { Spinner } from "../ui/spinner";
import AlertDialogBox from "../AlertDialogBox";
import { extractErrorMessage } from "@/lib/errorUtils";

const bookingStatusColors = {
  Confirmed: "text-blue-500",
  Cancelled: "text-red-500",
  CheckedIn: "text-green-500",
  CheckedOut: "text-violet-500",
  NoShow: "text-orange-500",
};

const paymentStatusColors = {
  Failed: "text-red-500",
  Paid: "text-green-500",
  Refunded: "text-violet-500",
  Pending: "text-orange-500",
};

const BookingListTable = ({
  headings,
  data = [],
  handleSearch,
  search,
  isLoading,
  isError,
  error,
}) => {
  console.log("error", error);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelBooking, setIsCancelBooking] = useState(false);

  const handleEditClick = (book) => {
    setSelectedBooking(book);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="">
      <div className=" mb-4  w-full md:w-[300px] ">
        <Input
          type="text"
          placeholder="Search rooms"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className=" h-[230px] items-center flex justify-center ">
          <Spinner />
        </div>
      ) : isError ? (
        <AlertDialogBox message={extractErrorMessage(error)} />
      ) : (
        <Table className="w-full mt-5">
          <TableCaption>{data?.length} rooms found</TableCaption>
          <TableHeader>
            <TableRow>
              {headings.map((item, index) => {
                return (
                  <TableHead key={index} className="w-[100px]">
                    {item}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row) => {
              return (
                <TableRow key={row?._id}>
                  <TableCell>{row?.hotel}</TableCell>
                  <TableCell>{row?.fullName}</TableCell>
                  <TableCell>{row?.Nic}</TableCell>
                  <TableCell>{row?.checkInDate.split("T")[0]}</TableCell>
                  <TableCell>{row?.checkOutDate.split("T")[0]}</TableCell>
                  <TableCell
                    className={bookingStatusColors[row?.bookingStatus]}
                  >
                    {row?.bookingStatus}
                  </TableCell>
                  <TableCell
                    className={paymentStatusColors[row?.paymentStatus]}
                  >
                    {row?.paymentStatus}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 cursor-pointer"
                      onClick={() => handleEditClick(row._id)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {isEditDialogOpen && (
        <DialogComponent
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title={!isCancelBooking ? "Edit booking status" : "Cancel Booking"}
          description="Make changes to the booking details."
        >
          <Booking
            isCancelBooking={isCancelBooking}
            bookId={selectedBooking}
            onCancel={() => setIsEditDialogOpen(false)}
          />

          <div className="flex justify-center items-center">
            <Button
              variant="ghost"
              className="text-blue-500 "
              onClick={() => setIsCancelBooking((prev) => !prev)}
            >
              {!isCancelBooking ? "Cancel booking" : "Update booking"}
            </Button>
          </div>
        </DialogComponent>
      )}
    </div>
  );
};

export default BookingListTable;
