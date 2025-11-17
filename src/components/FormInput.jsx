import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import Dropzone from "./Dropzone";
import { Combobox } from "@/components/ComboBox";
import { fa } from "zod/v4/locales";

const FormInput = ({
  name,
  label,
  placeholder,
  type = "text",
  multiple = false,
}) => {
  const form = useFormContext();

  return (
    <FormField
      className="mb-4"
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                value={field.value || ""}
              />
            ) : type === "text" ? (
              <Input
                type={type}
                value={field.value || ""}
                placeholder={placeholder}
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              />
            ) : type === "number" ? (
              <Input
                type={type}
                value={
                  field.value === null || field.value === undefined
                    ? ""
                    : Number(field.value)
                }
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? null : Number(value));
                }}
              />
            ) : (
              <Dropzone
                name={name}
                field={field}
                key={field.value ? field.value.length : 0}
                multiple={multiple}
              />
            )}
          </FormControl>

          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
