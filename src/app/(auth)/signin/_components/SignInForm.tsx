'use client'

import { type SigninInput, SigninSchema } from "@/validators/signin-validator"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
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
import { signinUserAction } from "@/actions/signin-user-action";

export default function SignInForm() {
  const form = useForm<SigninInput>({
    resolver: valibotResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  const { handleSubmit, control, formState, setError } = form;

  const onSubmit = async (data: SigninInput) => {
    const res = await signinUserAction(data)
    if (res.success) {
      window.location.href = "/"
    } else {
      switch (res.statusCode) {
        case 401: 
        setError("password",{message: res.error});
        break;
        case 500:
        default: 
        const error = res.error || "Internal Server Error";
        setError("password",{message: error});
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[400px]">

        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="john.smith@example.com"
                  className="w-full"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder="********"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={formState.isSubmitting} className="w-full">Ingresar</Button>

      </form>
    </Form>
  )
}
