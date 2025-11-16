import { useState, useCallback, useEffect } from "react";
import { Combobox } from "@/components/ComboBox";
import {
  useLazyGetHotelBySearchQuery,
  useAddCategoryMutation,
} from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import Dropzone from "../../components/Admin/Dropzone";

import { toast } from "sonner";
import { roomCategorySchema } from "../../lib/validations/roomCategoryValidation";
import { FaMinus } from "react-icons/fa";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

const CreateRoomCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hotelList, setHotelList] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [triggerSearch, { data: searchResults }] =
    useLazyGetHotelBySearchQuery();

  const [addCategory] = useAddCategoryMutation();

  console.log("searchResults", searchResults);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((searchTerm) => {
      triggerSearch(searchTerm);
    }, 500), // 500ms delay
    [triggerSearch]
  );

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  useEffect(() => {
    if (searchResults) {
      setHotelList(searchResults);
    }
  }, [searchResults]);

  const form = useForm({
    resolver: zodResolver(roomCategorySchema),
    defaultValues: {
      amenities: [],
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  console.log("selected hotel", hotel);
  async function onSubmit(values) {
    console.log(values);
    const formData = new FormData();
    formData.append("hotelId", values.hotelId);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("maxAdults", Number(values.maxAdults));
    formData.append("basePrice", Number(values.basePrice));

    values.amenities.forEach((amenity) => {
      formData.append("amenities", amenity);
    });
    values.images.forEach((image) => {
      formData.append("images", image);
    });

    console.log("formData", formData);

    try {
      await addCategory(formData).unwrap();
      //form.reset();
      toast.success("Hotel created successful !!!");
    } catch (error) {}
  }

  return (
    <div className="m-7">
      <h1 className="text-3xl font-bold mb-5  ">Create Room Category</h1>
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
                      list={searchResults}
                      value={hotel?.value}
                      setValue={setHotel}
                      placeholder="Search Hotels..."
                      handleChange={handleChange}
                      field={field}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              className="mb-4  w-full"
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Category</FormLabel>
                  <FormControl>
                    <Input placeholder=" Category name " {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Category Description" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category Price"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxAdults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Adults</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Maximum Adults"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Maximum Children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Children</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Maximum Children"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
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
                        <Button variant="ghost" size="icon" className="size-8">
                          <ChevronsUpDown />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="flex flex-col gap-2">
                      <div className="flex flex-col ">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex items-end gap-2">
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
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Dropzone name="images" field={field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="mt-4 bg-black text-white">
            Create Hotel
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateRoomCategory;
