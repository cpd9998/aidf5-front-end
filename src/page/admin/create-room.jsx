import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddHotelMutation } from "@/lib/api";
import Dropzone from "../../components/Admin/Dropzone";
import { formatBytes } from "../../lib/utils";
import { toast } from "sonner";

const CreateRoom = () => {
  const [addHotel] = useAddHotelMutation();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const formSchema = z.object({
    name: z.string({ message: "Name is required" }).min(2, {
      message: "Name must be at least 2 characters.",
    }),
    desc: z.string({ message: "Description is required" }).min(2, {
      message: "Description must be at least 2 characters.",
    }),

    image: z
      .any()
      .refine(
        (val) => {
          const file = val instanceof File ? val : val?.[0];
          return file instanceof File;
        },
        { message: "Please select an image file." }
      )
      .refine(
        (val) => {
          const file = val instanceof File ? val : val?.[0];
          return file && file.size <= MAX_FILE_SIZE;
        },
        {
          message: `The image is too large. Please choose an image smaller than ${formatBytes(
            MAX_FILE_SIZE
          )}.`,
        }
      )
      .refine(
        (val) => {
          const file = val instanceof File ? val : val?.[0];
          return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
        },
        { message: "Please upload a valid image file (JPEG, PNG, or WebP)." }
      ),

    country: z.string({ message: "Country is required" }).min(1, {
      message: "Country must be at least 1 character.",
    }),

    city: z.string({ message: "City is required" }).min(1, {
      message: "City must be at least 1 character.",
    }),
    price: z.number({ message: "Price is required" }).nonnegative({
      message: "Price must be a positive number",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values) {
    const imageFile =
      values.image instanceof File ? values.image : values.image?.[0] || null;
    console.log(
      "selected image file:",
      imageFile && {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      }
    );

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("desc", values.desc);
    formData.append("country", values.country);
    formData.append("city", values.city);
    formData.append("price", Number(values.price));
    if (imageFile) formData.append("image", imageFile);

    try {
      await addHotel(formData).unwrap();
      form.reset();
      toast.success("Hotel created successful !!!");
    } catch (error) {
      try {
        // await addHotel(formData).unwrap();
        await addHotel(values).unwrap();
        form.reset();
      } catch (error) {
        console.error("Failed to create hotel:", error);
      }
    }
  }

  return (
    <div className="m-7">
      <h1 className="text-3xl font-bold mb-5  ">Create Hotel</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:w-1/2 w-full "
        >
          <div className="flex gap-3 flex-col">
            <FormField
              className="mb-4"
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hotel Name" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Hotel Description" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder=" Country" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hotel Price"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Dropzone name="image" field={field} />
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

export default CreateRoom;
