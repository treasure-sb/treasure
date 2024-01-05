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

export const paymentLinkData = {
  Venmo: {
    url: "https://venmo.com/",
    icon: <VenmoIcon />,
  },
  Cashapp: {
    url: "https://cash.app/",
    icon: <CashappIcon />,
  },
};

export const getSocialIcon = (application: string): JSX.Element | null => {
  switch (application) {
    case "Instagram":
      return <InstagramIcon size={40} />;
    case "Twitter":
      return <Twitter size={40} />;
    case "TikTok":
      return <TikTokIcon />;
    case "Whatnot":
      return <WhatNotIcon />;
    default:
      return null;
  }
};

export const getPaymentIcon = (application: string) => {
  switch (application) {
    case "Venmo":
      return <VenmoIcon />;
    case "Cashapp":
      return <CashappIcon />;
    default:
      return null;
  }
};
