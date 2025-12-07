import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "./ComboBox";
const FormInputCombo = ({
  list = [],
  value,
  setValue,
  placeholder,
  handleChange,
  isLoading,
  name,
  label,
  form,
}) => {
  console.log("combo value", value);
  return (
    <FormField
      className="mb-4  w-full "
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Combobox
              list={list}
              value={value}
              setValue={setValue}
              placeholder={placeholder}
              handleChange={handleChange}
              field={field}
              isLoading={isLoading}
            />
          </FormControl>

          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default FormInputCombo;
