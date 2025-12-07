import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddHotelMutation, useUpdateHotelMutation } from "@/lib/api";
import { toast } from "sonner";
import { hotelSchema } from "../../lib/validations/HotelValidation";
import FormInput from "@/components/FormInput";
import { Spinner } from "@/components/ui/spinner";
import { Form } from "@/components/ui/form";
import { handleApiError } from "../../lib/errorUtils.js";
import { useNavigate } from "react-router-dom";

const Hotel = ({ hotel }) => {
  const navigate = useNavigate();

  const [addHotel, { isLoading: isCreating }] = useAddHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

  const form = useForm({
    resolver: zodResolver(hotelSchema),
  });

  const isLoading = isCreating || isUpdating;

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
      if (hotel) {
        await updateHotel({ hotel: formData, id: hotel._id }).unwrap();
        toast.success("Hotel updated successful !!!");
        setTimeout(() => {
          navigate("/admin/hotel-list");
        }, 1000);
      } else {
        await addHotel(formData);
        toast.success("Hotel created successful !!!");
      }
      form.reset();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  ">
          {hotel ? "Edit hotel" : "Create Hotel"}
        </h1>

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
              />
            </div>
            <Button
              type="submit"
              className="mt-4 bg-black text-white"
              disabled={isLoading}
            >
              {isLoading && <Spinner className="mr-2" />}
              {hotel ? "Edit hotel" : "Create hotel"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Hotel;
