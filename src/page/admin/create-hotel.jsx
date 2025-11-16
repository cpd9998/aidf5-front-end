import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddHotelMutation } from "@/lib/api";
import { toast } from "sonner";
import { createHotelSchema } from "../../lib/validations/createHotelValidation";
import FormInput from "@/components/FormInput";
import { Spinner } from "@/components/ui/spinner";
import { Form } from "@/components/ui/form";
import { handleApiError } from "../../lib/errorUtils.js";

const CreateHotel = () => {
  const [addHotel, { isLoading, isError, error }] = useAddHotelMutation();

  const form = useForm({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      name: "",
      desc: "",
      city: "",
      country: "",
      price: "",
      image: null,
    },
  });

  async function onSubmit(values) {
    const fieldsToAppend = ["name", "desc", "country", "city", "price"];
    const imageFile =
      values.image instanceof File ? values.image : values.image?.[0] || null;
    const formData = new FormData();

    fieldsToAppend.forEach((key) => {
      let value = values[key];
      if (key === "price") {
        value = Number(value);
      }

      formData.append(key, value);
    });

    formData.append("image", imageFile);

    try {
      await addHotel(formData).unwrap();
      form.reset();
      toast.success("Hotel created successful !!!");
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  ">Create Hotel</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full ">
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
              Create Hotel
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateHotel;
