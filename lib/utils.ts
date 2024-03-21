import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeSentence(string: string) {
  return string
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function convertToStandardTime(time: string) {
  return moment(time, "HH:mm").format("h:mm A");
}

export function filterPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, "");
}

export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

type PromiseResult<T> = {
  data: T | null;
  error: any | null;
};

export function to<T>(promise: Promise<T>): Promise<PromiseResult<T>> {
  return Promise.allSettled([promise]).then(function ([result]) {
    if (result.status === "fulfilled") {
      return { data: result.value, error: null };
    } else {
      return { data: null, error: result.reason };
    }
  });
}
