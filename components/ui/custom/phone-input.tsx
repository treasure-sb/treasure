"use client";

import { FloatingLabelInput } from "../floating-label-input";

export function filterPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, "");
}

export const formatPhoneNumber = (phoneNumber: string) => {
  let formattedPhoneNumber = filterPhoneNumber(phoneNumber);
  if (formattedPhoneNumber.length > 10) {
    formattedPhoneNumber = formattedPhoneNumber.substring(0, 10);
  }

  if (formattedPhoneNumber.length > 6) {
    formattedPhoneNumber = `(${formattedPhoneNumber.substring(
      0,
      3
    )}) ${formattedPhoneNumber.substring(
      3,
      6
    )}-${formattedPhoneNumber.substring(6)}`;
  } else if (formattedPhoneNumber.length > 3) {
    formattedPhoneNumber = `(${formattedPhoneNumber.substring(
      0,
      3
    )}) ${formattedPhoneNumber.substring(3)}`;
  }
  return formattedPhoneNumber;
};

interface PhoneInputProps {
  className?: string;
  phoneNumber: string;
  updatePhoneNumber: (phoneNumber: string) => void;
  [key: string]: any;
}

export default function PhoneInput({
  className,
  phoneNumber,
  updatePhoneNumber,
  ...props
}: PhoneInputProps) {
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    updatePhoneNumber(formattedPhoneNumber);
  };

  return (
    <FloatingLabelInput
      className={className}
      id="phone"
      type="tel"
      label="Phone Number"
      value={phoneNumber}
      onChange={handlePhoneInputChange}
      {...props}
    />
  );
}
