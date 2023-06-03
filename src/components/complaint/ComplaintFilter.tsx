import { SlidersHorizontal } from "lucide-react";
import { useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { GET_CATEGORY, GET_SUBCATEGORY } from "../../graphql/queries";
import { useQuery } from "@apollo/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Switch } from "../ui/switch";
import { useState } from "react";

const complaintFilterFormSchema = z.object({
  created_at: z.date().optional(),
  ticket_id: z.string().optional(),
  category_id: z.string().optional(),
  sub_category_id: z.string().optional(),
  status: z.enum(["Not Started", "Processing", "Resolved"]).optional(),
  has_image: z.boolean().optional(),
});

export interface ComplaintFilterFormType
  extends z.infer<typeof complaintFilterFormSchema> {}

export default function ComplaintFilter() {
  const form = useForm<ComplaintFilterFormType>({
    defaultValues: {
      has_image: false,
    },
    resolver: zodResolver(complaintFilterFormSchema),
  });

  const { setComplaintFilter } = useContext(ComplaintFilterContext);

  const { data: category_data } = useQuery<SelectCategoryReturnType, {}>(
    GET_CATEGORY
  );
  const { data: sub_category_data } = useQuery<SelectSubCategoryReturnType, {}>(
    GET_SUBCATEGORY
  );

  const onSubmit: SubmitHandler<ComplaintFilterFormType> = async (
    formData: ComplaintFilterFormType
  ) => {
    const intended_category = category_data?.category.find(
      (category) => category.category_id === formData.category_id
    )?.title;
    const intended_sub_category = sub_category_data?.sub_category.find(
      (sub_category) =>
        sub_category.sub_category_id === formData.sub_category_id
    )?.title;
    setComplaintFilter({
      created_at: formData.created_at || undefined,
      category: intended_category || undefined,
      sub_category: intended_sub_category || undefined,
      status: formData.status || undefined,
      has_image: formData.has_image || undefined,
    });
    setOpen(!open);
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-3" variant="secondary">
          <SlidersHorizontal size={16} />
          <span className="hidden sm:block">Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gray-700">
            Filter Complaints
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-3 space-y-6"
              >
                <div className="space-y-3">
                  <>
                    <div className="grid grid-cols-1 grid-rows-1 gap-3 xs:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="created_at"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Complaint Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    "Not Started",
                                    "Processing",
                                    "Resolved",
                                  ].map((status, index) => (
                                    <SelectItem key={index} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 grid-rows-1 gap-3 ">
                      <FormField
                        control={form.control}
                        name="category_id"
                        defaultValue=""
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(e) => {
                                field.onChange(e);
                                form.resetField("sub_category_id");
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {category_data?.category.map((category) => (
                                  <SelectItem
                                    key={category.category_id}
                                    value={category.category_id}
                                  >
                                    {category.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.getValues("category_id")?.length! > 0 ? (
                        <FormField
                          control={form.control}
                          name="sub_category_id"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Sub Category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sub_category_data?.sub_category
                                    ?.filter(
                                      (sub_category) =>
                                        sub_category.parent_category_id ===
                                        form.getValues("category_id")
                                    )
                                    ?.map((sub_category) => (
                                      <SelectItem
                                        key={sub_category.sub_category_id}
                                        value={sub_category.sub_category_id}
                                      >
                                        {sub_category.title}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="submit"
                    className="w-full px-6 py-3 font-semibold"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    className="w-full px-6 py-3 font-semibold"
                    variant="outline"
                    onClick={() => setOpen(!open)}
                  >
                    Close
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import { ComplaintFilterContext } from "@/components/shared/Layout";
