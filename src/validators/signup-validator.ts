import * as v from "valibot";

export const SignupSchema = v.pipe(
  v.object({
    name: v.optional(
      v.union([
        v.pipe(
          v.literal(""),
          v.transform(() => undefined)
        ),
        v.pipe(
          v.string("El nombre debe ser un string"),
          v.nonEmpty("Por favor ingrese un nombre"),
          v.minLength(6, "El nombre debe tener 6 caracteres o más")
        )
      ]
      )
    ),
    email: v.pipe(
      v.string("El email debe ser un string."),
      v.nonEmpty("Por favor ingrese un email."),
      v.email("La direccion de email no es válida.")
    ),
    password: v.pipe(
      v.string("La contraseña debe ser un string."),
      v.nonEmpty("Por favor ingrese su contraseña."),
      v.minLength(6, "La contraseña debe tener 6 caracteres o más."),
  ),
  confirmPassword: v.pipe(
    v.string("La contraseña debe ser un string."),
    v.nonEmpty("Por favor confirme su contraseña."),
  )
  }),

  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Las contraseñas no coinciden."
    ),
    ["confirmPassword"]
  )
);

export type SignupInput = v.InferInput<typeof SignupSchema>;