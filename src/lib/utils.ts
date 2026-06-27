import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatClp(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function absoluteUrl(pathname = "/") {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(pathname, baseUrl).toString();
}

export function maskRut(rut: string | null | undefined) {
  if (!rut) {
    return "Sin RUT";
  }

  const cleanRut = rut.replace(/[^\dkK]/g, "");

  if (cleanRut.length <= 4) {
    return cleanRut;
  }

  return `${cleanRut.slice(0, 2)}***${cleanRut.slice(-2)}`;
}
