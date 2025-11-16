import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../lib/features/searchSlice";

const formSchema = z.object({
  query: z.string().min(1, { message: "Search query is required" }),
});

const AISearch = () => {
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values) {
    dispatch(setSearchQuery(values.query));
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" lg:w-[80%] w-full px-2   mt-9 relative "
      >
        <FormField
          className="mb-4"
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Search for destinations, hotels, or experiences"
                  {...field}
                  className="rounded-full bg-black/80 py-4 text-white border-none  h-12"
                />
              </FormControl>

              <FormMessage className="text-white font-semibold" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="flex h-[40px] cursor-pointer items-center gap-2 absolute top-1 right-2 text-white p-2 border border-slate-200 rounded-full  "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-sparkles w-4 h-4 fill-white"
            aria-hidden="true"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
            <path d="M20 3v4"></path>
            <path d="M22 5h-4"></path>
            <path d="M4 17v2"></path>
            <path d="M5 18H3"></path>
          </svg>
          AI Search
        </Button>
      </form>
    </Form>
  );
};

export default AISearch;
