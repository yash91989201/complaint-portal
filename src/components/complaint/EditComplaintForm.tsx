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
import { useFileUpload } from "@nhost/react";
import { UPDATE_COMPLAINT_BY_PK } from "@/graphql/mutations";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";

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
interface Props {
  ticket_id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string;
  is_public: boolean;
}

export default function EditComplaintForm({
  ticket_id,
  title,
  description,
  category: categoryname,
  sub_category: subcategoryname,
  is_public,
}: Props) {
  const { data: category_data } = useQuery<SelectCategoryReturnType, {}>(
    GET_CATEGORY
  );
  const { data: sub_category_data } = useQuery<SelectSubCategoryReturnType, {}>(
    GET_SUBCATEGORY
  );

  const selected_category_id =
    category_data?.category.find((category) => category.title === categoryname)
      ?.category_id || "";

  const selected_sub_category_id =
    sub_category_data?.sub_category.find(
      (sub_category) => sub_category.title === subcategoryname
    )?.sub_category_id || "";

  const form = useForm<ComplaintFormType>({
    defaultValues: {
      title,
      description,
      category_id: selected_category_id,
      sub_category_id: selected_sub_category_id,
      is_public,
    },
    resolver: zodResolver(complaintFormSchema),
  });

  const [updateComplaint, { loading: insertComplaintLoading }] = useMutation<
    UpdateComplaintByPkReturnType,
    UpdateComplaintByPkVarType
  >(UPDATE_COMPLAINT_BY_PK, {
    refetchQueries: [{ query: GET_COMPLAINTS }],
  });

  const { upload } = useFileUpload();

  const onSubmit: SubmitHandler<ComplaintFormType> = async (
    formData: ComplaintFormType
  ) => {
    const createComplaintNotification = toast.loading(
      "Updating your complaint ..."
    );
    try {
      // const { id: image_id } = await upload(formData?.image?.[0]!);

      const { errors } = await updateComplaint({
        variables: {
          ticket_id,
          title: formData.title,
          description: formData.description,
          category: category_data?.category.find(
            (category) => category.category_id === formData.category_id
          )?.title!,
          sub_category: sub_category_data?.sub_category.find(
            (sub_category) =>
              sub_category.sub_category_id === formData.sub_category_id
          )?.title!,
          is_public: formData.is_public,
          image_id: "",
        },
      });

      if (!errors && !insertComplaintLoading) {
        toast.success("Complaint updated successfully.", {
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
        <Button className="flex items-center px-4 py-2 space-x-3 rounded-full w-fit">
          <Edit2 size={14} /> <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your complaint</DialogTitle>
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
                  <div className="grid grid-cols-2 grid-rows-1 gap-3">
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e);
                              form.resetField("sub_category_id");
                            }}
                            defaultValue={selected_category_id}
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
                    <FormField
                      control={form.control}
                      name="sub_category_id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={selected_sub_category_id}
                          >
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
                  </div>
                  <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between w-full p-3 border rounded-lg">
                        <FormLabel className="text-base">
                          Make this complaint public
                        </FormLabel>
                        <FormControl>
                          <Switch
                            className="-mt-1"
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
                    Update
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
