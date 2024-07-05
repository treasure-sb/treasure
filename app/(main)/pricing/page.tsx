import PlanCard from "./components/PlanCard";

export default function Page() {
    return (
      <main className="-translate-y-36">
        <div className="flex flex-col items-center scale-75">
          <div className="mb-2 mt-0 text-center">
            <h1 className="mb-8 text-[2.5rem] font-bold text-white">Start supercharging your<br/> event management & growth today</h1>
            <div className="flex flex-row p-10">
              <PlanCard
                color="black"
                name="Basic"
                description="A plan with event basics. Recommended for small events"
                features={["Unlimited Events", "Unlimited Applications", "Mobile Check-In App"]}
              />
              
              <div className="relative bottom-8 shadow-2xl shadow-[#78df95] rounded-3xl">
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
          <p className="text-white italic text-xs relative right-72">**Standard credit card and ACH fees not included.</p>
        </div>
        <div className="items-center flex w-[100%]">
          <h1 className="mb-8 text-[2.5rem] font-bold text-white text-center w-[100%]">Compare Features by Plan.</h1>
        </div>
        
      </main>
    
    
    )
}