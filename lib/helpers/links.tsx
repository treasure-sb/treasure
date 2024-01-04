import InstagramIcon from "@/components/icons/applications/InstagramIcon";
import TwitterIcon from "@/components/icons/applications/TwitterIcon";
import TikTokIcon from "@/components/icons/applications/TikTokIcon";
import WhatNotIcon from "@/components/icons/applications/WhatNotIcon";
import VenmoIcon from "@/components/icons/applications/VenmoIcon";
import CashappIcon from "@/components/icons/applications/CashappIcon";

export const socialLinkData = {
  Instagram: {
    url: "https://instagram.com/",
  },
  Twitter: {
    url: "https://twitter.com/",
  },
  TikTok: {
    url: "https://tiktok.com/",
  },
  Whatnot: {
    url: "https://whatnot.com/",
  },
};

export const paymentLinkData = {
  Venmo: {
    url: "https://venmo.com/",
  },
  Cashapp: {
    url: "https://cash.app/",
  },
};

export const getSocialIcon = (application: string): JSX.Element | null => {
  switch (application) {
    case "Instagram":
      return <InstagramIcon />;
    case "Twitter":
      return <TwitterIcon />;
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
