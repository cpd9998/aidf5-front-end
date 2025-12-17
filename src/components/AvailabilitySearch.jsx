import Calender from "./Calender";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import GuestSelector from "./GuestSelector";
import { Spinner } from "./ui/spinner";

const AvailabilitySearch = (args) => {
  console.log("isLoading", args.isLoading);
  return (
    <div className="mt-20 px-2 w-full ">
      <h1 className="text-3xl font-bold">Availability</h1>
      <div className="w-full">
        <div className="flex lg:flex-row flex-col lg:gap-2 gap-5 mt-5 lg:items-end">
          <div className="lg:w-1/5 w-full flex flex-col gap-2">
            <Label>Check In</Label>
            <Calender setDate={args.setCheckIn} date={args.checkIn} />
          </div>
          <div className="lg:w-1/5 w-full flex flex-col gap-2">
            <Label>Check Out</Label>
            <Calender setDate={args.setCheckOut} date={args.checkout} />
          </div>
          <div className="lg:w-1/5 w-full flex flex-col gap-2">
            <Label>Guests</Label>
            <GuestSelector
              adults={args.adults}
              children={args.children}
              onAdultsChange={args.setAdults}
              onChildrenChange={args.setChildren}
              buttonText={`${
                args.adults + " Adult" + " " + args.children + " Children"
              } `}
            />
          </div>

          <div className="lg:w-auto w-full">
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-800 h-9 w-full lg:w-auto"
              onClick={args.handleCheckAvailability}
              disabled={args.isLoading}
            >
              {args.isLoading && <Spinner />}
              Check availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySearch;
