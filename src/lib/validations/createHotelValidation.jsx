import { z } from "zod";
import { formatBytes } from "../utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createHotelSchema = z.object({
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
