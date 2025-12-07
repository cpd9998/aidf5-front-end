import { useState, useEffect } from "react";
import { Combobox } from "@/components/ComboBox";
import {
  useLazyGetHotelBySearchQuery,
  useGetRoomCategoryByIdQuery,
} from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { roomCategorySchema } from "../../lib/validations/RoomCategoryValidation";
import { FaMinus } from "react-icons/fa";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import FormInput from "../FormInput";

import { useDebounce } from "@/hooks/useDebounce";
import { useParams } from "react-router";
import { useUpdateHRoomCategoryMutation } from "../../lib/api";

const RoomCategoryComponent = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [hotelList, setHotelList] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [updateHRoomCategory] = useUpdateHRoomCategoryMutation();

  const [
    triggerSearch,
    { data: searchResults, isLoading: isLoadingRoomCatagory },
  ] = useLazyGetHotelBySearchQuery();

  console.log("Seacrh result", searchResults);

  const {
    data: roomCategoryData,
    isLoading: isLoadingRoomCategory,
    isError: isErrorRoomCategory,
    error,
  } = useGetRoomCategoryByIdQuery(id);

  //const isLoading = isLoadingRoomCatagory || isLoadingAddRoomcategory;
  console.log("roomCategoryData", roomCategoryData);

  const form = useForm({
    resolver: zodResolver(roomCategorySchema),
  });

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
    if (roomCategoryData) {
      let hotelData = {
        value: roomCategoryData.hotelId._id,
        label: roomCategoryData.hotelId.name,
        id: roomCategoryData.hotelId._id,
      };

      setHotel(hotelData || null);

      form.reset({
        hotelId: roomCategoryData?.hotelId._id,
        name: roomCategoryData?.name,
        description: roomCategoryData?.description,
        basePrice: Number(roomCategoryData?.basePrice),
        maxAdults: Number(roomCategoryData?.maxAdults),
        maxChildren: Number(roomCategoryData?.maxChildren),
        amenities: roomCategoryData?.amenities || [],
        images: roomCategoryData?.images || [],
      });
    }
  }, [searchResults, roomCategoryData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  async function onSubmit(values) {
    const fieldsToAppend = [
      "hotelId",
      "name",
      "description",
      "maxAdults",
      "maxChildren",
      "basePrice",
      "amenities",
      "images",
    ];

    console.log("values", values);

    const formData = new FormData();

    fieldsToAppend.forEach((key) => {
      let value = values[key];

      if (key === "maxAdults" || key === "maxChildren" || key === "basePrice") {
        value = Number(value);
        formData.append(key, value);
      } else if (key === "amenities") {
        value.forEach((val) => {
          formData.append(key, val);
        });
      } else if (key === "images") {
        value.forEach((val) => {
          formData.append(key, val);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      await updateHRoomCategory({ hotel: formData, id: id }).unwrap();
      form.reset({
        hotelId: "",
        name: "",
        description: "",
        basePrice: "", // Reset them to the desired empty state
        maxAdults: "",
        maxChildren: "",
        amenities: [],
        images: [],
      });
      setHotel(null);
      setHotelList([]);

      toast.success("Hotel created successful !!!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  ">Update Room Category</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="lg:w-1/2 w-full "
          >
            <div className="flex gap-3 flex-col">
              <FormField
                className="mb-4  w-full "
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Hotel</FormLabel>
                    <FormControl>
                      <Combobox
                        list={hotelList}
                        value={hotel || ""}
                        setValue={setHotel}
                        placeholder="Search Hotels..."
                        handleChange={handleChange}
                        field={field}
                        // isLoading={isLoading}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormInput
                name="name"
                label="Category"
                placeholder="Category name"
              />

              <FormInput
                name="description"
                label="Description"
                placeholder="Category Description"
                type="textarea"
              />

              <FormInput
                name="basePrice"
                label="Base Price"
                placeholder="Enter base price"
                type="number"
              />

              <FormInput
                name="maxAdults"
                label="Maximum Adults"
                placeholder="Enter maximum adult"
                type="number"
              />

              <FormInput
                name="maxChildren"
                label="Maximum Children"
                placeholder="Enter maximum children"
                type="number"
              />

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <Collapsible
                      open={isOpen}
                      onOpenChange={setIsOpen}
                      className="flex w-[350px] flex-col gap-2"
                    >
                      <div className="flex items-center  gap-4 ">
                        <FormLabel>Amenities</FormLabel>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent className="flex flex-col gap-2">
                        <div className="flex flex-col ">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex items-end gap-2"
                            >
                              <FormField
                                control={form.control}
                                name={`amenities.${index}`}
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormControl>
                                      <Input
                                        placeholder={`Amenity #${index + 1}`}
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-8 w-8 shrink-0 rounded-full"
                              >
                                <FaMinus className="text-red-500" />
                              </Button>
                            </div>
                          ))}

                          <a
                            onClick={() => append("")}
                            className="text-blue-500 text-sm mt-2"
                          >
                            Add Amenities
                          </a>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormInput
                name="images"
                label="Images"
                placeholder="Enter image"
                type="images"
                multiple={true}
              />
            </div>
            <Button type="submit" className="mt-4 bg-black text-white">
              {/* {isLoading && <Spinner />} */}
              Update Room Catagory
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateRoomCategory;
