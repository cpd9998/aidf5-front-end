import { string, z } from "zod";

// Zod validation schema for Room
export const bookingSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .trim(),
  email: z
    .string({ message: "Email  is required" })
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  phone: z
    .string({ message: "Mobile number is required" })
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .trim(),
  idNumber: z.string({ message: "Nic number is required" }),
  address: z.string({ message: "Address  is required" }),
  specialRequests: z.string().optional(),
});
