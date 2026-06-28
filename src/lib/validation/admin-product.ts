import { z } from "zod";

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string().min(1).optional(),
);

const checkboxValue = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

const optionalNumber = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim().length === 0) {
      return undefined;
    }

    if (value === null || value === undefined) {
      return undefined;
    }

    return Number(value);
  },
  z.number().nonnegative().optional(),
);

export const adminProductFormSchema = z
  .object({
    id: optionalString,
    name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres."),
    slug: z
      .string()
      .trim()
      .min(3, "El slug debe tener al menos 3 caracteres.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "El slug solo puede usar minúsculas, números y guiones.",
      ),
    sku: z.string().trim().min(3, "El SKU debe tener al menos 3 caracteres."),
    categoryId: optionalString,
    shortDescription: optionalString,
    description: optionalString,
    price: z.coerce.number().nonnegative("El precio debe ser igual o mayor a 0."),
    compareAtPrice: optionalNumber,
    stock: z.coerce.number().int().nonnegative("El stock no puede ser negativo."),
    minimumStock: z.coerce
      .number()
      .int()
      .nonnegative("El stock mínimo no puede ser negativo."),
    trackStock: checkboxValue,
    allowBackorder: checkboxValue,
    isFeatured: checkboxValue,
    isNew: checkboxValue,
    status: z.enum(["draft", "active", "inactive", "archived"]),
    primaryImageUrl: optionalString,
    primaryImageAlt: optionalString,
    secondaryImageUrl: optionalString,
    secondaryImageAlt: optionalString,
  })
  .refine(
    (data) =>
      data.compareAtPrice === undefined || data.compareAtPrice >= data.price,
    {
      path: ["compareAtPrice"],
      message: "El precio anterior debe ser mayor o igual al precio actual.",
    },
  );

export type AdminProductFormInput = z.infer<typeof adminProductFormSchema>;
