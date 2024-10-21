import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isValidTime(value: string) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
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

export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function formatDate(date: string) {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return formattedDate;
}

export function formatDates(
  dates: { date: string; start_time: string; end_time: string }[]
) {
  let formattedDates: { date: string; start_time: string; end_time: string }[] =
    [];
  dates.map((date) => {
    let formattedDate = {
      date: formatDate(date.date),
      start_time: convertToStandardTime(date.start_time),
      end_time: convertToStandardTime(date.end_time),
    };
    formattedDates.push(formattedDate);
  });
  return formattedDates;
}

export function roundPrice(price: string) {
  return parseFloat(parseFloat(price).toFixed(2));
}

export const subtractFiveHours = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - 5);
  return newDate;
};

export const normalizeDate = (date: Date) => {
  const adjustedDate = subtractFiveHours(date);
  adjustedDate.setHours(0, 0, 0, 0);
  return adjustedDate.toISOString().slice(0, 10);
};

export const formatEmailDate = (dates: string[]) => {
  let formattedEventDate: string = "";
  dates.map((date, i) => {
    if (dates.length === i + 1) {
      formattedEventDate += formatDate(date);
    } else {
      formattedEventDate += formatDate(date) + " / ";
    }
  });
  return formattedEventDate;
};

export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type PromiseResult<T> = {
  data: T | null;
  error: any | null;
};

export type NonNullableExcept<T, K extends keyof T> = {
  [P in keyof T]-?: P extends K ? T[P] : NonNullable<T[P]>;
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

export function toMany<T>(promises: Promise<T>[]): Promise<PromiseResult<T>> {
  return Promise.allSettled([...promises]).then(function ([result]) {
    if (result.status === "fulfilled") {
      return { data: result.value, error: null };
    } else {
      return { data: null, error: result.reason };
    }
  });
}
