import { UseFormReturn } from "react-hook-form";

export interface profileForm {
  first_name: string;
  last_name: string;
  instagram: string;
  twitter: string;
  bio: string;
  avatar_url: string;
}

export interface LinkType {
  [key: string]: string;
}

export interface paymentsForm {
  venmo: string;
  zelle: string;
  cashapp: string;
  paypal: string;
}

export interface vendorTransactionForm {
  vendor_id: string;
  item_name: string;
  amount: string;
  method: string;
}

type EditProfileFormData = {
  first_name: string;
  last_name: string;
  username: string;
  bio?: string;
  social_links?: {
    username: string;
    application: string;
    type: string;
  }[];
  payment_links?: {
    username: string;
    application: string;
    type: string;
  }[];
};

export type EditProfileFormReturn = UseFormReturn<
  EditProfileFormData,
  any,
  undefined
>;
