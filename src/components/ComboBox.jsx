import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";

export function Combobox({
  list = [],
  value = "",
  setValue = null,
  placeholder,
  handleChange = null,
  field,
  isLoading,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  console.log("Combo  value", list);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value ? value.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command className=" bg-white ">
          <div className="flex justify-between items-center pr-5 ">
            <CommandInput
              placeholder={placeholder}
              className="h-9 "
              onKeyPress={handleChange}
            />
            {isLoading && <Spinner />}
          </div>

          <CommandList className="border-t">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {list.length > 0 &&
                list.map((data) => (
                  <CommandItem
                    key={data?.value}
                    value={data?.value}
                    onSelect={(currentValue) => {
                      const hotelData = list.find(
                        (data) => data.label === currentValue
                      );
                      field?.onChange(hotelData.id);
                      setValue(hotelData);
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
