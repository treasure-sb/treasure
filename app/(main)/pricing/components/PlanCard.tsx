import { Button } from "@/components/ui/button";
interface PlanCardProps {
    name: string;
    description: string;
    btnText?: string;
    price?: string;
    features: string[];
    color: string;
    recommended?: boolean;
}

export default function PlanCard({
    name,
    description,
    price,
    features,
    color,
    btnText = 'Choose Plan',
    recommended = false

}: PlanCardProps) {
    const backgroundColor = color
    const length = features.length == 3 ? 41.5 : 8- ((features.length * 1.5))
    return (
    <div style ={{backgroundColor: color }}className="flex min-h-[428px] w-[320px] flex-col rounded-3xl p-8">
      <div className="ml-4">
          {recommended && <div className="self-center h-7"><Button className="rounded-3xl relative -right-20 -top-4" size="sm" style={{backgroundColor: "black", color: "black" }}>
              <text className="text-xs text-[#73D08D] font-bold">MOST POPULAR</text>
          </Button></div>}
          <h2 className='mb-5 text-4xl font-bold text-left'  style={{color:backgroundColor === "black" ? "#73D08D" : "black"}}>
            {price ? <><text className="font-bold text-4xl" style={{color:backgroundColor === "black" ? "#73D08D" : "black"}}>${price}</text><text className=" text-lg font-normal" style={{color:backgroundColor === "black" ? "white" : "black"}}> /month</text></>  
            : "Free"}
          </h2>
          <div className="mb-2 flex items-end text-2xl font-medium" style={{color:backgroundColor === "black" ? "#73D08D" : "black"}}>{name} </div>
          <p className="mb-5 text-left" style={{color:backgroundColor === "black" ? "white" : "black"}}>{description}</p>
          <ul className="mb-10 flex flex-col gap-y-2">
              {features.map((feature) => (
                  <li className="flex items-center mb-2" key={feature}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z" fill="#73D08D"/>
                          <path d="M15.7724 6.83337L10.0683 14.5742C9.93221 14.7547 9.72936 14.873 9.50527 14.9024C9.28118 14.9319 9.05465 14.8701 8.87659 14.7309L4.80325 11.4742C4.44381 11.1866 4.3856 10.662 4.67325 10.3025C4.9609 9.94309 5.48547 9.88489 5.84492 10.1725L9.24159 12.89L14.4308 5.84754C14.6009 5.5922 14.8976 5.45103 15.2031 5.48007C15.5086 5.50912 15.7734 5.70368 15.8923 5.98652C16.0113 6.26935 15.9653 6.59469 15.7724 6.83337Z" fill="#0D0F0E"/>
                      </svg>
                      <text className="ml-3" style={{color:backgroundColor === "black" ? "white" : "black"}}>{feature}</text>
                  </li>
              ))}
          </ul>
          <p className="text-left mb-8" style={{color:backgroundColor === "black" ? "white" : "black"}}>4% Transaction Fees**</p>
          <Button className="rounded-3xl sm:relative top-36" size="lg" style={{backgroundColor:backgroundColor === "black" ? "73D08D" : "black", color: backgroundColor === "black" ? "black" : "white", top:length }}>
              <text className="px-4">{btnText}</text>
          </Button>
      </div>
    </div>)
}