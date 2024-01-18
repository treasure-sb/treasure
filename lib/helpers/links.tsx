import { InstagramIcon } from "lucide-react";
import { Twitter } from "lucide-react";
import TikTokIcon from "@/components/icons/applications/TikTokIcon";
import WhatNotIcon from "@/components/icons/applications/WhatNotIcon";
import VenmoIcon from "@/components/icons/applications/VenmoIcon";
import CashappIcon from "@/components/icons/applications/CashappIcon";

type SocialLink = {
  url: string;
  icon: JSX.Element;
};

type SocialLinkData = {
  [key: string]: SocialLink;
};

type PaymentLink = {
  url: string;
  icon: JSX.Element;
  payment_subtext: string;
};

type PaymentLinkData = {
  [key: string]: PaymentLink;
};

export const socialLinkData: SocialLinkData = {
  Instagram: {
    url: "https://instagram.com/",
    icon: <InstagramIcon size={40} />,
  },
  Twitter: {
    url: "https://twitter.com/",
    icon: <Twitter size={40} />,
  },
  TikTok: {
    url: "https://tiktok.com/@",
    icon: <TikTokIcon />,
  },
  Whatnot: {
    url: "https://whatnot.com/",
    icon: <WhatNotIcon />,
  },
};

export const paymentLinkData: PaymentLinkData = {
  Venmo: {
    url: "https://venmo.com/",
    icon: <VenmoIcon />,
    payment_subtext: "Payment made through Venmo",
  },
  Cashapp: {
    url: "https://cash.app/",
    icon: <CashappIcon />,
    payment_subtext: "Payment made through Cashapp",
  },
};
