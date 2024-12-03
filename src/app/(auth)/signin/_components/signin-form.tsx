"use client";

import { type SigninInput, SigninSchema } from "@/validators/signin-validator";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
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
import { signinUserAction } from "@/actions/user-action/signin-user-action";
import Image from "next/image";
import OAuthSigninButtons from "@/app/(auth)/signin/_components/oauth-signin-buttons";

export default function SignInForm() {
  const form = useForm<SigninInput>({
    resolver: valibotResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const onSubmit = async (data: SigninInput) => {
    const res = await signinUserAction(data);
    if (res.success) {
      window.location.href = "/";
    } else {
      switch (res.statusCode) {
        case 401:
          setError("password", { message: res.error });
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("password", { message: error });
      }
    }
  };
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-balance text-muted-foreground">
              Ingrese sus datos para iniciar sesión
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-[400px] space-y-8"
            >
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
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full"
              >
                Ingresar
              </Button>
            </form>
          </Form>
          <OAuthSigninButtons />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
