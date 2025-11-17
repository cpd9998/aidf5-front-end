import { z } from "zod";
import { formatBytes } from "../utils";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const SingleFileSchema = z
  .instanceof(File, { message: "Item must be a valid File object." })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `Image is too large. Max size is ${formatBytes(MAX_FILE_SIZE)}.`,
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Invalid file type. Only JPEG, PNG, or WebP are supported.",
  });

export const roomCategorySchema = z.object({
  hotelId: z.string({ message: "Hotel is required" }).min(2, {
    message: "Hotel is required",
  }),
  name: z.string({ message: "Category  is required" }).min(2, {
    message: "Category  must be at least 2 characters.",
  }),
  description: z.string({ message: "Description is required" }).min(2, {
    message: "Description must be at least 2 characters.",
  }),
  basePrice: z.number({ message: "Base Price is required" }).nonnegative({
    message: "Price must be a positive number",
  }),
  maxAdults: z
    .number({ message: "Maximum adult count is  required" })
    .nonnegative({
      message: "Adult count must be a positive number",
    }),

  maxChildren: z.number().optional(),

  amenities: z
    .array(z.string().min(1, { message: "Amenity name cannot be empty." }))
    .min(1, { message: "At least one amenity is required." })
    .default([]),

  images: z
    .array(SingleFileSchema) // Applies file-specific validation to every item
    .min(1, { message: "At least one image is required." })
    .max(MAX_FILES, {
      message: `You can upload a maximum of ${MAX_FILES} images.`,
    }),
});
