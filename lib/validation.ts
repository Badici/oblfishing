import { z } from "zod";
import { isValidRoPhone } from "@/lib/phone";

const optionalText = z
  .string()
  .trim()
  .max(120, "Textul este prea lung.")
  .optional()
  .or(z.literal(""));

export const checkoutSchema = z
  .object({
    fulfillment: z.enum(["pickup", "delivery"], {
      message: "Alege ridicarea personală sau livrarea.",
    }),
    lastName: z
      .string()
      .trim()
      .min(2, "Introdu numele.")
      .max(80, "Numele este prea lung."),
    firstName: z
      .string()
      .trim()
      .min(2, "Introdu prenumele.")
      .max(80, "Prenumele este prea lung."),
    phone: z
      .string()
      .trim()
      .min(8, "Introdu un număr de telefon.")
      .refine(isValidRoPhone, "Introdu un număr de telefon valid din România."),
    email: z
      .string()
      .trim()
      .max(120, "Emailul este prea lung.")
      .refine(
        (value) => value === "" || z.string().email().safeParse(value).success,
        "Introdu un email valid.",
      ),
    notes: z
      .string()
      .trim()
      .max(1000, "Observațiile sunt prea lungi.")
      .optional()
      .or(z.literal("")),
    county: optionalText,
    city: optionalText,
    street: optionalText,
    building: optionalText,
    staircase: optionalText,
    floor: optionalText,
    apartment: optionalText,
    postalCode: z
      .string()
      .trim()
      .max(10)
      .refine(
        (value) => value === "" || /^\d{6}$/.test(value),
        "Codul poștal trebuie să aibă 6 cifre.",
      )
      .optional()
      .or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.fulfillment !== "delivery") return;

    if (!value.county || value.county.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["county"],
        message: "Introdu județul.",
      });
    }
    if (!value.city || value.city.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["city"],
        message: "Introdu localitatea.",
      });
    }
    if (!value.street || value.street.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["street"],
        message: "Introdu strada și numărul.",
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const emptyCheckoutValues: CheckoutFormValues = {
  fulfillment: "pickup",
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  notes: "",
  county: "",
  city: "",
  street: "",
  building: "",
  staircase: "",
  floor: "",
  apartment: "",
  postalCode: "",
};
