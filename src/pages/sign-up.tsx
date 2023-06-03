import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import {
  GET_CATEGORY,
  GET_COMPLAINTS,
  GET_SUBCATEGORY,
} from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import {
  useFileUpload,
  useSignInEmailPassword,
  useSignUpEmailPassword,
} from "@nhost/react";
import { INSERT_COMPLAINT } from "@/graphql/mutations";
import Image from "next/image";
import { useEffect, useState } from "react";
import apollo_client from "@/config/apollo-client";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const MAX_FILE_SIZE = 5 * (1024 * 1024);
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const complaintFormSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

interface ComplaintFormType extends z.infer<typeof complaintFormSchema> {}

export default function SignUp() {
  const form = useForm<ComplaintFormType>({
    resolver: zodResolver(complaintFormSchema),
  });

  const router = useRouter();

  const { signUpEmailPassword, isLoading, isSuccess, error } =
    useSignUpEmailPassword();

  const onSubmit: SubmitHandler<ComplaintFormType> = async (
    formData: ComplaintFormType
  ) => {
    try {
      await signUpEmailPassword(formData.email, formData.password, {
        displayName: formData.username,
      });
    } catch (error) {}
  };
  if (isSuccess) {
    router.push("/sign-in");
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full max-w-sm p-6 space-y-6 border rounded "
        >
          <div className="w-full space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Username</FormDescription>
                  <FormControl>
                    <Input placeholder="Username" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>E-Mail</FormDescription>
                  <FormControl>
                    <Input placeholder="E-Mail" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Password</FormDescription>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col w-full space-y-6">
            <div className="flex flex-col space-y-3">
              <Button variant="outline" className="w-full rounded-full">
                Sign Up
              </Button>
              {/* <Button variant="outline" className="w-full rounded-full">
                Sign In With Google
              </Button> */}
            </div>
            {/* <div className="relative">
              <Separator />
              <span className="absolute  -translate-x-1/2 -translate-y-1/2 left-1/2 -top-[0.1rem] bg-white text-gray-500 h-fit w-6  inline-flex justify-center">
                or
              </span>
            </div> */}
            {/* <Button variant="outline" className="w-full rounded-full">
              Sign Up
            </Button> */}
            <p className="text-center">
              <span>Don&apos;t have an account?</span>
              <Button
                variant="link"
                className="text-blue-600 underline"
                type="button"
              >
                <Link href="/sign-in"> Sign In</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
