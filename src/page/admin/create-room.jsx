import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { roomSchema } from "../../lib/validations/RoomValidation";
import { Spinner } from "@/components/ui/spinner";
import { handleApiError } from "../../lib/errorUtils.js";
import { Form } from "@/components/ui/form";
import {
  useGetRoomCategoryByHotelQuery,
  useLazyGetHotelBySearchQuery,
  useAddRoomMutation,
} from "../../lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import FormInputCombo from "../../components/FormInputCombo";
import FormInput from "../../components/FormInput";

const CreateRoom = () => {
  const [hotelList, setHotelList] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState("");

  console.log("statsu", status);
  const [
    triggerSearch,
    {
      data: searchResults,
      isLoading: isLoadingHotel,
      isError: isHotelError,
      error: hotelError,
    },
  ] = useLazyGetHotelBySearchQuery();

  const { data: categories, isLoading: isLoadingRoomCategory } =
    useGetRoomCategoryByHotelQuery(
      {
        hotelId: hotel?.id,
      },
      {
        skip: !hotel?.id,
      }
    );

  const [addRoom, { isLoading: isLoadingRoom, isError: isError, error }] =
    useAddRoomMutation();

  const statusLst = [
    {
      id: 1,
      label: "Available",
      value: "Available",
    },
    {
      id: 2,
      label: "Occupied",
      value: "Occupied",
    },
    { id: 3, label: "Maintenance", value: "Maintenance" },
    { id: 4, label: "Cleaning", value: "Cleaning" },
  ];

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      hotelId: "",
      categoryId: "",
      status: "",
      floor: 0,
    },
  });

  console.log("Hotel Error", hotelError);

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

    if (status) {
      console.log("status", status);
      form.setValue("status", status.value);
    }
  }, [searchResults, categories, hotel, form, status]);

  async function onSubmit(values) {
    console.log("values", values);
    try {
      await addRoom(values).unwrap();
      form.reset({
        roomNumber: "",
        hotelId: "",
        categoryId: "",
        status: "",
        floor: 0,
      });
      setHotelList(null);
      setHotel(null);
      setCategoryList(null);
      setCategory(null);
      setStatus(null);
      toast.success("Room created successful !!!");
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  ">Create Room</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="lg:w-1/2 w-full "
          >
            <div className="flex gap-3 flex-col">
              <FormInputCombo
                list={hotelList || []}
                value={hotel}
                setValue={setHotel}
                placeholder="Search Hotels..."
                handleChange={handleChange}
                isLoading={isLoadingHotel}
                name="hotelId"
                label="Hotel"
                form={form}
              />

              <FormInputCombo
                list={categoryList || []}
                value={category}
                setValue={setCategory}
                placeholder="Select Category"
                handleChange={handleChange}
                isLoading={isLoadingRoomCategory}
                name="categoryId"
                label="Select Category"
                form={form}
              />
              <FormInputCombo
                list={statusLst || []}
                value={status}
                setValue={setStatus}
                placeholder="Select Status"
                handleChange={handleChange}
                isLoading={null}
                name="status"
                label="Select Status"
                form={form}
              />

              <FormInput
                name="roomNumber"
                label="Room Number"
                placeholder="Enter Room number"
                type="text"
              />
              <FormInput
                name="floor"
                label="Floor"
                placeholder="Enter Floor"
                type="number"
              />

              <Button
                type="submit"
                className="mt-4 bg-black text-white"
                disabled={isLoadingRoom}
              >
                {isLoadingRoom && <Spinner className="mr-2" />}
                Create Room
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateRoom;
