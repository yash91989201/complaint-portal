import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignInEmailPassword } from "@nhost/react";

import { useRouter } from "next/router";
import Link from "next/link";

const complaintFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

interface ComplaintFormType extends z.infer<typeof complaintFormSchema> {}

export default function SignUp() {
  const form = useForm<ComplaintFormType>({
    resolver: zodResolver(complaintFormSchema),
  });

  const router = useRouter();
  const {
    signInEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
  } = useSignInEmailPassword();

  const onSubmit: SubmitHandler<ComplaintFormType> = async (
    formData: ComplaintFormType
  ) => {
    try {
      await signInEmailPassword(formData.email, formData.password);
    } catch (error) {}
  };
  if (isSuccess) {
    router.push("/");
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
                Sign In
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
              <Button variant="link" className="text-blue-600 underline">
                <Link href="/sign-up"> Sign Up</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
