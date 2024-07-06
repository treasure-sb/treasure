import { Button } from "@/components/ui/button";
import PlanCard from "./components/PlanCard";
import ComparisonRow from "./components/ComparisonRow";

export default function Page() {
    return (
      <main className="-translate-y-36">
        <div className="flex flex-col items-center scale-75">
          <div className="mb-2 mt-0 text-center">
            <h1 className="mb-8 text-[2.5rem] font-bold text-white">Start supercharging your<br/> event management & growth today</h1>
            <div className="flex sm:flex-row p-10 flex-col">
              <PlanCard
                color="black"
                name="Basic"
                description="A plan with event basics. Recommended for small events"
                features={["Unlimited Events", "Unlimited Applications", "Mobile Check-In App"]}
              />
              
              <div className="sm:relative sm:bottom-8 sm:shadow-2xl shadow-[#78df95] rounded-3xl">
                  <PlanCard
                    color="#73D08D"
                    name="Starter"
                    description="Unlock data analytics and CRM tools to grow your events"
                    features={["Unlimited Events", "Unlimited Applications", "Mobile Check-In App", "Attendee & Vendor CRM"]}
                    price="20"
                    recommended = {true}
                  />
              </div>

              
              
              <PlanCard
                color="black"
                name="Pro"
                description="Advanced tools to take your events to the next level"
                features={["Unlimited Events", "Unlimited Applications", "Mobile Check-In App", "Full Analytics Suite"]}
                price="40"
              />
            </div>
              
          </div>
          <p className="text-white italic text-xs sm:relative right-72 text-center">**Standard credit card and ACH fees not included.</p>
        </div>
        <div className="hidden min-[1165px]:block scale-90">
          <div className="items-center flex w-[100%]">
            <h1 className="mb-8 text-[2.5rem] font-bold text-white text-center w-[100%]">Compare Features by Plan.</h1>
          </div>
          <div className=" w-[100%]">
            <div className="flex flex-row w-[100%] border-b-2 border-[#73D08D] pb-4">
              {/*Column Titles*/}
              <div className="items-center w-[25%] mr-8 mt-3">
                <span className="text-2xl font-bold mr-8 text-[#73D08D] ml-8">Compare Plans</span>
                <div className="mt-10 ml-8">
                <span className=" text-white text-sm ">Choose your Treasure plan according to your eventing needs</span>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/4 mx-1">
                <div className="text-4xl font-bold text-[#73D08D] text-center">
                  Basic <span className="text-[#858BA0] text-xs">free</span>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="mt-2 px-16"><span className="mx-2">Choose This Plan</span></Button>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/4 mx-1">
                <div className="text-4xl font-bold text-[#73D08D] text-center">
                  Starter <span className="text-[#858BA0] text-xs">$20/month</span>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="mt-2 px-16"><span className="mx-2">Choose This Plan</span></Button>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/4 mx-1">
                <div className="text-4xl font-bold text-[#73D08D] text-center">
                  Pro <span className="text-[#858BA0] text-xs">$40/month</span>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="mt-2 px-16"><span className="mx-2">Choose This Plan</span></Button>
                </div>
              </div>
            </div>

          </div>
          {/*Rows*/}
          <ComparisonRow name="Unlimited Events" col1={true} col2={true} col3={true} />
          <ComparisonRow name="Mobile Check-In App" col1={true} col2={true} col3={true} isGreen={true}/>
          <ComparisonRow name="Full Vendor CRM Suite" col3={true} />
          <ComparisonRow name="Dedicated URL per event" col1={true} col2={true} col3={true} isGreen={true}/>
          <ComparisonRow name="Social Media Sharing" col2={true} col3={true} />
          <ComparisonRow name="Event Highlights" col2={true} col3={true} isGreen={true}/>
          <ComparisonRow name="Unlimited Vendor Applications" col2={true} col3={true} />
          <ComparisonRow name="Unlimited Attendees" col2={true} col3={true} isGreen={true}/>
          <ComparisonRow name="24/7 Customer Support" col1={true} col2={true} col3={true} />
          <ComparisonRow name="Event Page Analytics" col3={true} isGreen={true}/>
          <ComparisonRow name="Unlimited SMS blasts" col1={true} col2={true} col3={true} />
        </div>
        
      </main>
    
    
    )
}