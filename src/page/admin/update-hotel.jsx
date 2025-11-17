import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useGetHotelByIdQuery, useUpdateHotelMutation } from "../../lib/api";
import { useEffect } from "react";
import { hotelSchema } from "../../lib/validations/HotelValidation";
import { handleApiError } from "../../lib/errorUtils";
import { Spinner } from "@/components/ui/spinner";
import FormInput from "../../components/FormInput";

const UpdateHotel = () => {
  const { id } = useParams();
  const { data: hotel, isLoading: isLoadingHotelData } =
    useGetHotelByIdQuery(id);
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

  const isLoading = isLoadingHotelData || isUpdating;

  const form = useForm({
    resolver: zodResolver(hotelSchema),
  });

  useEffect(() => {
    if (hotel) {
      form.reset({
        name: hotel?.name,
        desc: hotel?.desc,
        country: hotel?.country,
        city: hotel?.city,
        price: hotel?.price,
        image: hotel?.image,
      });
    }
  }, [hotel, form]);

  async function onSubmit(values) {
    const fieldsToAppend = ["name", "desc", "country", "city", "price"];

    const formData = new FormData();
    fieldsToAppend.forEach((key) => {
      let value = values[key];
      if (key === "price") {
        value = Number(value);
      }

      formData.append(key, value);
    });

    const imageFile =
      values.image instanceof File ? values.image : values.image;

    if (imageFile) formData.append("image", imageFile);

    try {
      await updateHotel({ hotel: formData, id: hotel._id }).unwrap();
      form.reset();
      toast.success("Hotel updated successful !!!");
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <div className="m-7">
      <h1 className="text-3xl font-bold mb-5  ">Update Hotel</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:w-1/2 w-full "
        >
          <div className="flex gap-3 flex-col">
            <FormInput
              name="name"
              label="Name"
              placeholder="Enter hotel name"
            />

            <FormInput
              name="desc"
              label="Description"
              placeholder="Enter hotel description"
              type="textarea"
            />
            <FormInput name="city" label="City" placeholder="Enter city" />
            <FormInput
              name="country"
              label="Country"
              placeholder="Enter country"
            />
            <FormInput
              name="price"
              label="Price"
              placeholder="Enter price"
              type="number"
            />
            <FormInput
              name="image"
              label="Image"
              placeholder="Enter image"
              type="image"
              multiple={false}
            />
          </div>
          <Button
            type="submit"
            className="mt-4 bg-black text-white"
            disabled={isLoading}
          >
            {isLoading && <Spinner className="mr-2" />}
            Update Hotel
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateHotel;
