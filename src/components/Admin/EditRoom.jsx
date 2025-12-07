import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { roomSchema } from "@/lib/validations/RoomValidation";
import { useDebounce } from "@/hooks/useDebounce";
import { useUpdateRoomMutation, useGetRoomByIdQuery } from "@/lib/api";
import FormInput from "@/components/FormInput";
import FormInputCombo from "@/components/FormInputCombo";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ComboBox";

const statusLst = [
  {
    id: "Available",
    label: "Available",
    value: "Available",
  },
  {
    id: "Occupied",
    label: "Occupied",
    value: "Occupied",
  },
  { id: "Maintenance", label: "Maintenance", value: "Maintenance" },
  { id: "Cleaning", label: "Cleaning", value: "Cleaning" },
];

export const EditRoom = ({ room, onSubmit, onCancel }) => {
  const [hotel, setHotel] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState("");
  const [
    updateRoom,
    { isLoading: isLoadingUpdateRoom, isError: isErrorUpdateRoom },
  ] = useUpdateRoomMutation();

  const {
    data: roomData,
    isLoading: isLoadingRoom,
    isError: isErrorRoom,
  } = useGetRoomByIdQuery(room?.id);

  const form = useForm({
    resolver: zodResolver(roomSchema),
  });

  async function onSubmit(values) {
    try {
      await updateRoom({ room: values, id: room?.id }).unwrap();
      onCancel();
    } catch (error) {}
  }

  useEffect(() => {
    if (roomData) {
      setHotel({
        value: roomData.hotelId._id,
        label: roomData.hotelId.name,
        id: roomData.hotelId._id,
      });

      setCategory({
        value: roomData.categoryId._id,
        label: roomData.categoryId.name,
        id: roomData.categoryId._id,
      });

      form.reset({
        hotelId: roomData.hotelId._id,
        categoryId: roomData.categoryId._id,
        roomNumber: roomData?.roomNumber,
        floor: Number(roomData?.floor),
        status: roomData.status,
      });

      // Set status
      const matchedStatus = statusLst.find((s) => s.value === roomData.status);
      if (matchedStatus) {
        setStatus(matchedStatus);
      }
    }
  }, [roomData]);

  console.log("room data", roomData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:w-1/2 w-full ">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              className="mb-4  w-full "
              control={form.control}
              name="hotelId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Hotel</FormLabel>
                  <FormControl>
                    <Combobox
                      value={hotel || ""}
                      setValue={setHotel}
                      placeholder="Search Hotels..."
                      field={field}
                      disabled={true}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              className="mb-4  w-full "
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Combobox
                      value={category || ""}
                      setValue={setCategory}
                      placeholder="Search Categories..."
                      field={field}
                      disabled={true}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              name="roomNumber"
              label="Room Number"
              placeholder="Enter room number"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              name="floor"
              label="Floor"
              placeholder="Enter floor number"
              type="number"
            />
          </div>

          <div className="grid gap-2">
            <FormInputCombo
              list={statusLst || []}
              value={
                status || { label: roomData?.status, value: roomData?.status }
              }
              setValue={setStatus}
              placeholder="Select Status"
              name="status"
              label="Select Status"
              form={form}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className=" bg-black text-white"
            disabled={isLoadingUpdateRoom}
          >
            {isLoadingUpdateRoom && <Spinner className="mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
