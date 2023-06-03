import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import {
  GET_CATEGORY,
  GET_COMPLAINTS,
  GET_SUBCATEGORY,
} from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

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
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "../ui/switch";
import { useFileUpload, useUserId } from "@nhost/react";
import { INSERT_COMPLAINT } from "@/graphql/mutations";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";

const MAX_FILE_SIZE = 5 * (1024 * 1024);
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const complaintFormSchema = z.object({
  title: z.string().min(1).max(60),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(250, { message: "Description cannot be more than 250 character(s)" }),
  category_id: z.string(),
  sub_category_id: z.string(),
  is_public: z.boolean(),
  image:
    typeof window === "undefined"
      ? z.any()
      : z
          .instanceof(FileList)
          .refine(
            (file) => file?.[0]?.size <= MAX_FILE_SIZE,
            `Max image size is 5MB.`
          )
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
          )
          .optional(),
});

interface ComplaintFormType extends z.infer<typeof complaintFormSchema> {}

export default function CreateComplaintForm() {
  const form = useForm<ComplaintFormType>({
    defaultValues: {
      is_public: true,
    },
    resolver: zodResolver(complaintFormSchema),
  });

  const { data: category_data } = useQuery<SelectCategoryReturnType, {}>(
    GET_CATEGORY
  );
  const { data: sub_category_data } = useQuery<SelectSubCategoryReturnType, {}>(
    GET_SUBCATEGORY
  );

  const userId = useUserId();

  const [insertComplaint, { loading: insertComplaintLoading }] = useMutation<
    InsertComplaintReturnType,
    InsertComplaintVarType
  >(INSERT_COMPLAINT, {
    refetchQueries: [
      {
        query: GET_COMPLAINTS,
      },
    ],
  });

  // const { upload } = useFileUpload();

  const onSubmit: SubmitHandler<ComplaintFormType> = async (
    formData: ComplaintFormType
  ) => {
    const createComplaintNotification = toast.loading(
      "Registering your complaint..."
    );
    try {
      // const { id: image_id } = await upload({ file: formData?.image?.[0]! });
      //
      const { errors } = await insertComplaint({
        variables: {
          title: formData.title,
          description: formData.description,
          category: category_data?.category.find(
            (category) => category.category_id === formData.category_id
          )?.title!,
          sub_category: sub_category_data?.sub_category.find(
            (sub_category) =>
              sub_category.sub_category_id === formData.sub_category_id
          )?.title!,
          status: "Not Started",
          is_public: formData.is_public,
          image_id: "",
          user_id: userId!,
        },
      });

      if (!errors && !insertComplaintLoading) {
        toast.success("Complaint created successfully", {
          id: createComplaintNotification,
        });
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: createComplaintNotification,
        });
      }
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center space-x-2 font-semibold sm:px-4 sm:py-2 w-fit sm:w-auto">
          <PlusCircle size={16} />
          <span className="hidden sm:block">Create Complaint</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gray-700">
            Register a new complaint
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-3 space-y-6"
              >
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <Input placeholder="Title" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Complaint Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 grid-rows-1 gap-3 md:grid-cols-2">
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
                    {form.getValues().category_id?.length > 0 ? (
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
                  <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between w-full p-3 space-y-0 border rounded-lg">
                        <FormLabel>Make this complaint public</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                      return (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                field.onChange(event.target.files);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
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
                    onClick={() => {
                      setOpen(!open);
                      form.reset();
                    }}
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
