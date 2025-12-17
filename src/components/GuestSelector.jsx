import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@radix-ui/react-label";
import NumberInput from "./NumberInput";

const GuestSelector = ({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  buttonText = "Select Members",
  adultLabel = "Adult",
  childrenLabel = "Children",
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-center h-9">
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white"
        align="start"
        side="bottom"
        avoidCollisions={false}
      >
        <div className="flex flex-col gap-2 p-2">
          <div className="flex justify-between items-center gap-4">
            <Label>{adultLabel}</Label>
            <NumberInput value={adults} onChange={onAdultsChange} />
          </div>
          <div className="flex justify-between items-center gap-4">
            <Label>{childrenLabel}</Label>
            <NumberInput value={children} onChange={onChildrenChange} />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GuestSelector;
