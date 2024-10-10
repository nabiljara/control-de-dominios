'use client'

import { type SignupInput, SignupSchema } from "@/validators/signup-validator"
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
import { signupUserAction } from "@/actions/signup-user-action";
import { useState } from "react";
import Link from "next/link";


export default function SignUpForm() {

  const form = useForm<SignupInput>({
    resolver: valibotResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const { handleSubmit, control, formState, reset, setError } = form;
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: SignupInput) => {
    const res = await signupUserAction(data)

    if (res.success) {
      setSuccess(true)
    }
    else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;
          for (const key in nestedErrors) {
            setError(key as keyof SignupInput, {
              message: nestedErrors[key]?.[0],
            })
          }
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("confirmPassword", {
            message: error,
          })
          break;
      }
    }
    console.log(res)
  }

  if (success) {
    return (
      <div>
        <p>Se ha registrado correctamente.</p>
        <Button variant='link' size="sm" className="px-0" asChild>
        <Link href="/signin">Iniciar sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[400px]">
        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  typeof="text"
                  placeholder="John Smith"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
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

        <Button type="submit" disabled={formState.isSubmitting} className="w-full">Registrarse</Button>

      </form>
    </Form>
  )
}
