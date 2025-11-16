import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  list = [],
  value,
  setValue,
  placeholder,
  handleChange,
  field,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? list.find((data) => data.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command className=" bg-white">
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onKeyPress={handleChange}
          />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {list.map((data) => (
                <CommandItem
                  key={data?.value}
                  value={data?.value}
                  onSelect={(currentValue) => {
                    const hotelData = list.find(
                      (data) => data.label === currentValue
                    );
                    console.log("currentvalue", currentValue);
                    field.onChange(hotelData.id);
                    setValue(
                      currentValue === value
                        ? ""
                        : { id: hotelData.id, value: currentValue }
                    );
                    setOpen(false);
                  }}
                >
                  {data.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === data.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
