import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { bookingSchema } from "@/lib/validations/BookingValidation";
import FormInput from "./FormInput";
import { useLocation } from "react-router-dom";
import { useAddBookingMutation } from "@/lib/api";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/errorUtils";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

const BookingDetail = () => {
  const navigate = useNavigate();
  const [addBooking, { isLoading, isError, error }] = useAddBookingMutation();
  const location = useLocation();
  const {
    hotelId,
    categoryId,
    categoryName,
    checkInDate,
    checkOutDate,
    maxAdults,
    maxChildren,
    totalPrice,
    images,
  } = location.state || {};

  const form = useForm({
    resolver: zodResolver(bookingSchema),
  });

  async function onSubmit(values) {
    try {
      const { specialRequests, ...guestData } = values;

      const formData = {
        hotelId,
        categoryId,
        guestDetails: { ...guestData },
        checkInDate,
        checkOutDate,
        numberOfAdults: maxAdults,
        numberOfChildren: maxChildren,
        specialRequests,
      };
      const res = await addBooking(formData).unwrap();
      navigate("/payments", {
        state: {
          order_id: res.bookingNumber,
          amount: res.totalAmount,
          currency: "LKR",
          ...res.guestDetails,
        },
      });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 px-4">Enter booking details</h1>

        <div className="flex flex-col lg:flex-row gap-6 px-4">
          {/* Left side - Hotel Info (Sticky) */}
          <div className="w-full lg:w-2/5 xl:w-1/3">
            <div className="lg:sticky lg:top-4 space-y-4">
              <BookingInfo
                categoryName={categoryName}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                maxAdults={maxAdults}
                maxChildren={maxChildren}
                images={images}
                totalPrice={totalPrice}
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* First name & Last name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="firstName"
                      label="First name"
                      placeholder="Enter first name"
                    />
                    <FormInput
                      name="lastName"
                      label="Last name"
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* Address & NIC */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="address"
                      label="Address"
                      placeholder="Enter Address"
                    />
                    <FormInput
                      name="idNumber"
                      label="Nic"
                      placeholder="Enter nic"
                    />
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="email"
                      label="Email"
                      placeholder="Enter email"
                    />
                    <FormInput
                      name="phone"
                      label="Mobile"
                      placeholder="Enter mobile"
                    />
                  </div>

                  <FormInput
                    name="specialRequests"
                    label="Special Requesr"
                    placeholder="Enter request"
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-black text-white px-8 py-3 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading && <Spinner />}
                      Make Payment
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;

const BookingInfo = ({
  categoryName,
  checkInDate,
  checkOutDate,
  maxAdults,
  maxChildren,
  images,
  totalPrice,
}) => {
  return (
    <div className="space-y-4">
      {/* Hotel Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="relative h-48 md:h-64">
          <img
            src={
              images?.[0] ||
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop"
            }
            alt="Hotel view"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 md:p-6">
          {/* Stars and Thumbs Up */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="bg-yellow-400 rounded-lg p-1.5">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-2">{categoryName}</h2>
          <p className="text-sm md:text-base text-gray-700 mb-3">
            COLOMBO-GALLE MAIN ROAD 523C, Ginthota, 80280 Galle, Sri Lanka
          </p>
          <p className="text-green-600 font-semibold mb-4">
            Great Location — 8.6
          </p>

          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-700 text-white font-bold px-3 py-2 rounded-lg text-lg">
              8.1
            </div>
            <div>
              <span className="font-semibold text-gray-900">Very Good</span>
              <span className="text-gray-600 text-sm"> · 619 reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Your booking details
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-gray-600 font-semibold mb-1 text-sm">Check-in</p>
            <p className="text-lg md:text-xl font-bold mb-1">
              {checkInDate || "Wed, Dec 17, 2025"}
            </p>
            <p className="text-gray-600 text-xs md:text-sm">From 2:00 PM</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold mb-1 text-sm">
              Check-out
            </p>
            <p className="text-lg md:text-xl font-bold mb-1">
              {checkOutDate || "Thu, Dec 18, 2025"}
            </p>
            <p className="text-gray-600 text-xs md:text-sm">Until 12:00 PM</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex-shrink-0">
            <div className="w-7 h-7 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <span className="text-orange-500 font-bold text-lg">!</span>
            </div>
          </div>
          <p className="text-orange-700 font-semibold text-sm">
            Just 2 days away!
          </p>
        </div>

        <div className="border-t border-gray-200 mb-4"></div>

        <div>
          <p className="text-gray-600 font-semibold mb-2 text-sm">
            You selected
          </p>
          <p className="text-lg md:text-xl font-bold mb-2">
            1 night, 1 room for {maxAdults || 2} adults{" "}
            {maxChildren > 0 && `& ${maxChildren} children`}
          </p>
          <p className="text-gray-700 mb-3 text-sm">
            1 x Deluxe Room - Sea View
          </p>
          <a
            href="#"
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            Change your selection
          </a>
        </div>
        <div className="flex justify-between items-center mt-3 text-xl">
          <h3 className="font-bold  ">Total Price:</h3>
          <p>LKR {totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
