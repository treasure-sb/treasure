"use client";
import { Button } from "@/components/ui/button";
import PlanCard from "./components/PlanCard";
import ComparisonRow from "./components/ComparisonRow";
import { validateUser } from "@/lib/actions/auth";

export default async function Page() {
  const unicode = "&#65291";
  return (
    <div className="">
      <div className="flex flex-col items-center">
        <div className="mb-2 mt-0 text-center mx-auto">
          <div className="w-full flex justify-center">
            <h1 className="sm:mb-8 text-[2.5rem] font-bold">
              Start <span className="text-[#73D08D]">supercharging</span> your
              <br className="hidden sm:block" /> event management & growth today
            </h1>
          </div>

          <div className="flex md:flex-row justify-center flex-col mx-auto my-8 gap-6 md:gap-0 w-full ">
            <PlanCard
              color="black"
              name="Basic"
              description="A plan with event basics. Recommended for small events"
              features={[
                "Unlimited Events, Tickets and Vendor Applications",
                "One Admin Profile",
                "Weekly Payouts",
                "24/7 Customer Support",
                "Mobile Check-in App Access",
              ]}
              percentFee="4"
            />

            <PlanCard
              color="#73D08D"
              name="Pro"
              description="The plan for most events. Made for small teams, businesses, and organizations."
              features={[
                "Everything included in the Basic plan",
                "Embedded Checkout",
                "5 Admin/Staff Accounts",
                "Daily Payout",
              ]}
              price="35"
              recommended={true}
              percentFee="2"
            />

            <PlanCard
              color="black"
              name="Enterprise"
              description="Our most coveted plan, including the best customer service, tailored features, and 24/7 support"
              features={[
                `Everything included in the Pro plan`,
                "Dedicated Account Manager",
                "Full Analytics Suite",
                "Event Financing",
                "Tailored Features",
              ]}
              price=" --"
              percentFee="2"
              btnText="Contact Us for Pricing"
            />
          </div>
        </div>
      </div>
      <div className="hidden min-[1165px]:block scale-90">
        <div className="items-center flex w-[100%]">
          <h1 className="mb-8 text-[2.5rem] font-bold text-center w-[100%]">
            Compare Features by Plan.
          </h1>
        </div>
        <div className=" w-[100%]">
          <div className="flex flex-row w-[100%] border-b-2 border-[#73D08D] gap-4 pb-6">
            {/*Column Titles*/}
            <div className="items-center w-[25%] pl-8 flex flex-col gap-4 justify-end pb-2">
              <h2 className="text-2xl font-bold text-[#73D08D] text-left w-full">
                Compare Plans
              </h2>

              <p className="text-sm">
                Choose your Treasure plan according to your eventing needs
              </p>
            </div>
            <div className="flex flex-col items-center w-1/4">
              <div className="text-4xl font-bold text-[#73D08D] text-center">
                Basic <span className="text-[#858BA0] text-xs">free</span>
              </div>
              <div className="mt-6">
                <Button size="lg" className="mt-2 px-16">
                  <span className="mx-2">Choose This Plan</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center w-1/4">
              <div className="text-4xl font-bold text-[#73D08D] text-center">
                Pro <span className="text-[#858BA0] text-xs">$35/month</span>
              </div>
              <div className="mt-6">
                <Button size="lg" className="mt-2 px-16">
                  <span className="mx-2">Choose This Plan</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center w-1/4">
              <div className="text-4xl font-bold text-[#73D08D] text-center">
                Enterprise{" "}
                <span className="text-[#858BA0] text-xs">$ - -/month</span>
              </div>
              <div className="mt-6">
                <Button size="lg" className="mt-2 px-16">
                  <span className="mx-2">Choose This Plan</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/*Rows*/}
        <ComparisonRow
          name="Unlimited Events"
          col1={true}
          col2={true}
          col3={true}
        />
        <ComparisonRow
          name="Unlimited Tickets"
          col1={true}
          col2={true}
          col3={true}
          isGreen={true}
        />
        <ComparisonRow
          name="# of Admin Accounts"
          col1Text="1"
          col2Text="5"
          col3Text="Unlimited"
        />{" "}
        {/*Text instead of check*/}
        <ComparisonRow
          name="Unlimited Vendors"
          col1={true}
          col2={true}
          col3={true}
          isGreen={true}
        />
        <ComparisonRow name="Embedded Checkout" col2={true} col3={true} />
        <ComparisonRow
          name="Unlimited Special Guests"
          col1={true}
          col2={true}
          col3={true}
          isGreen={true}
        />
        <ComparisonRow
          name="Mobile Check-In App Beta"
          col2={true}
          col3={true}
        />
        <ComparisonRow
          name="Transaction Fee"
          col1Text="4%"
          col2Text="2%"
          col3Text="2%"
          isGreen={true}
        />{" "}
        {/*Text instead of check*/}
        <ComparisonRow
          name="Full Vendor CRM Suite"
          col1={true}
          col2={true}
          col3={true}
        />
        <ComparisonRow
          name="Venue Maps"
          col1={true}
          col2={true}
          col3={true}
          isGreen={true}
        />
        <ComparisonRow
          name="Dedicated URL per event"
          col1={true}
          col2={true}
          col3={true}
        />
        <ComparisonRow
          name="Social Media Promotion"
          col2={true}
          col3={true}
          isGreen={true}
        />
        <ComparisonRow
          name="Event Gallery"
          col1={true}
          col2={true}
          col3={true}
        />
        <ComparisonRow
          name="Unlimited Vendor Applications"
          col1={true}
          col2={true}
          col3={true}
          isGreen={true}
        />
        <ComparisonRow
          name="24/7 Customer Support"
          col1Text="Within 24 hrs"
          col2Text="Within an hour"
          col3Text="Instant"
        />{" "}
        {/*Text instead of check*/}
        <ComparisonRow
          name="Dedicated Event Manager"
          col3={true}
          isGreen={true}
        />
        <ComparisonRow
          name="Unlimited SMS blasts"
          col1={true}
          col2={true}
          col3={true}
        />
      </div>
    </div>
  );
}
