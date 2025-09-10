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
import OAuthSigninButtons from "@/app/(auth)/signin/_components/oauth-signin-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInForm() {
  const form = useForm<SigninInput>({
    resolver: valibotResolver(SigninSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password",
    },
    mode:'onSubmit'
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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Ingrese con su cuenta de google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthSigninButtons />
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 max-w-[400px]"
            >
              <div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center mt-6 after:border-t after:border-border text-sm text-center">
                <span className="z-10 relative bg-background px-2 text-muted-foreground">
                  O continua con
                </span>
              </div>
              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingrese su correo electrónico"
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
                        placeholder="Ingrese su contraseña"
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
        </CardContent>
      </Card>
    </div>
  );
}
