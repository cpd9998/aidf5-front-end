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
import Dropzone from "../components/Admin/Dropzone";

const FormInput = ({ name, label, placeholder, type = "text" }) => {
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
                value={field.value || ""}
                placeholder={placeholder}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            ) : (
              <Dropzone
                name={name}
                field={field}
                key={field.value ? field.value.length : 0}
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
