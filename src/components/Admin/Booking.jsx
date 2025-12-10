import { Combobox } from "@/components/ComboBox";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import {
  useUpdateBookingStatusMutation,
  useUpdateCancelBookingMutation,
} from "@/lib/api";
import { toast } from "sonner";
import { extractErrorMessage, handleApiError } from "@/lib/errorUtils";
import { Spinner } from "../ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import AlertDialogBox from "@/components/AlertDialogBox";

const bookingStatusList = [
  {
    label: "Confirmed",
    value: "Confirmed",
    id: "Confirmed",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
    id: "Cancelled",
  },
  {
    label: "CheckedIn",
    value: "CheckedIn",
    id: "CheckedIn",
  },
  {
    label: "CheckedOut",
    value: "CheckedOut",
    id: "CheckedOut",
  },
  {
    label: "NoShow",
    value: "NoShow",
    id: "NoShow",
  },
];

const Booking = ({ isCancelBooking, bookId, onCancel }) => {
  const [
    updateBookingStatus,
    {
      isLoading: isSaveBooking,
      isError: isSaveBookingError,
      error: bookingError,
    },
  ] = useUpdateBookingStatusMutation();

  const [
    updateCancelBooking,
    { isLoading: isLoadingCancel, isError: isCancelError, error: cancelError },
  ] = useUpdateCancelBookingMutation();

  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [reason, setReason] = useState("");

  const isLoading = isSaveBooking || isLoadingCancel;

  const isError = isSaveBookingError || isCancelError;

  useEffect(() => {
    if (status || reason) {
      setError(false);
    }
  }, [status, reason]);

  const onSubmit = async () => {
    try {
      if (!isCancelBooking) {
        if (!status) {
          setError(true);
          return;
        }
      } else {
        if (!reason) {
          setError(true);
          return;
        }
      }
      if (!isCancelBooking) {
        await updateBookingStatus({
          status: status.value,
          id: bookId,
        }).unwrap();
      } else {
        await updateCancelBooking({
          reason: reason,
          id: bookId,
        });
      }

      onCancel();
    } catch (error) {}
  };

  return (
    <div className="full">
      <div className="flex flex-col gap-2 mb-2">
        <Label> {!isCancelBooking ? "Booking status" : "Cancel reason"}</Label>

        {isError ? (
          <AlertDialogBox
            message={extractErrorMessage(bookingError || cancelError)}
          />
        ) : !isCancelBooking ? (
          <Combobox
            list={bookingStatusList || []}
            value={status || ""}
            setValue={setStatus}
            placeholder="Search status..."
          />
        ) : (
          <Input
            type="text"
            placeholder="Enter reason"
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        {error && (
          <span className="text-red-500 text-sm">
            {!isCancelBooking
              ? " Payment status is required"
              : "Cancel reason is required"}
          </span>
        )}
        <Button
          type="button"
          className="mt-4 bg-black text-white"
          disabled={isSaveBooking}
          onClick={onSubmit}
        >
          {isLoading && <Spinner className="mr-2" />}
          Update
        </Button>
      </div>
    </div>
  );
};

export default Booking;
