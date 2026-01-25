import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { // cn = class names
  return twMerge(clsx(inputs));
}
