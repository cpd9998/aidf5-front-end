import { z } from "zod";

// Zod validation schema for Room
export const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").trim(),

  hotelId: z.string().min(1, "Hotel  is required"),

  categoryId: z.string().min(1, "Category  is required"),

  status: z.enum(["Available", "Occupied", "Maintenance", "Cleaning"], {
    errorMap: () => ({
      message: "Status must be Available, Occupied, Maintenance, or Cleaning",
    }),
  }),

  floor: z
    .number({ message: "floor number is required" })
    .int("Floor must be an integer")
    .min(1, "Floor must be at least 1"),
});
