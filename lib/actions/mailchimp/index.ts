"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
  server: "us21",
});

const addSubscriber = async (email: string) => {
  try {
    await mailchimp.lists.addListMember(
      process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID as string,
      {
        email_address: email,
        status: "subscribed",
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export { addSubscriber };
