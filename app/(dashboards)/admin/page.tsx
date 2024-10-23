"use client";
import Link from "next/link";
import {
  UsersIcon,
  BadgeDollarSign,
  Star,
  MessageCircle,
  AppWindowIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendTicketPurchasedEmail } from "@/lib/actions/emails";
import { TicketPurchasedProps } from "@/emails/TicketPurchased";
import { google, outlook, yahoo, ics, CalendarEvent } from "calendar-link";

export default function Page() {
  const sendEmail = async () => {
    const ticketPurchasedEmailProps: TicketPurchasedProps = {
      eventName: "Garden State Card Show",
      posterUrl:
        "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
      ticketType: "General Admission",
      quantity: 1,
      location: "8868 1st St, Los Angeles, CA 90048 United States of America",
      date: "Sat, March 3, / Sun, March 4, 2024",
      guestName: "John Ventura",
      totalPrice: "$3.00",
      eventInfo:
        "Round 2 was the best one yet of our shows! They just get bigger and bigger and round 3 will be no exception. 3/3/24 will have free public street parking and food set up in the back of the show which includes bagel with cream cheese, butter, peanut butter and hot dogs for lunch at an affordable rate. We will have over 60 vendors showcasing the very best of their products including Pokemon, plush, one piece, yugioh and many more! Best place to spend your tax refund! The first show was inspired by corocoro mew and our tee shirt design was made and finalized. Round 3 is inspired by the world renowned classic game",
      isGuestCheckout: false,
      event_date: "2024-03-03",
    };

    const email = "adam.callahan33@gmail.com";
    const purchasedTicketID = "56f99ac8-0652-41e4-8474-cac44d350fd1";
    const eventID = "b6b3fa58-e064-48f5-84e1-3e7b350398fc";

    await sendTicketPurchasedEmail(
      email,
      purchasedTicketID,
      eventID,
      ticketPurchasedEmailProps
    );
    console.log("email sent");
  };

  return (
    <div className="lg:grid grid-cols-5 gap-4 flex flex-col">
      <Link
        href={`/admin/invoices`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Invoices
          </h3>
          <UsersIcon size={28} className="flex-shrink-0" />
        </div>
      </Link>
      <Link
        href={`/admin/likes`}
        className="bg-secondary rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Likes
          </h3>
          <BadgeDollarSign size={28} className="flex-shrink-0" />
        </div>
      </Link>
      <Link
        href={`/admin/promo`}
        className="bg-secondary rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Promo
          </h3>
          <BadgeDollarSign size={28} className="flex-shrink-0" />
        </div>
      </Link>
      <Button onClick={sendEmail}>send email</Button>
    </div>
  );
}
