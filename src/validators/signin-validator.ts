import * as v from "valibot";

export const SigninSchema =
  v.object({
    email: v.pipe(
      v.string("El email debe ser un string."),
      v.nonEmpty("Por favor ingrese un email."),
      v.email("La direccion de email no es válida.")
    ),
    password: v.pipe(
      v.string("La contraseña debe ser un string."),
      v.nonEmpty("Por favor ingrese su contraseña."),
  ),
  })

export type SigninInput = v.InferInput<typeof SigninSchema>;