export interface profileForm {
  first_name: string;
  last_name: string;
  instagram: string;
  twitter: string;
  bio: string;
  avatar_url: string;
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
