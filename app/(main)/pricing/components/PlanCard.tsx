import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
interface PlanCardProps {
  name: string;
  description: string;
  btnText?: string;
  price?: string;
  features: string[];
  color: string;
  recommended?: boolean;
  percentFee: string;
}

export default function PlanCard({
  name,
  description,
  price,
  features,
  color,
  btnText = "Choose Plan",
  recommended = false,
  percentFee,
}: PlanCardProps) {
  const length = 8 - features.length * 1.5;
  return (
    <>
      {color === "black" ? (
        <>
          <div className="bg-black flex min-h-[428px] md:w-96 w-full flex-col rounded-3xl p-8">
            <div className="ml-4 flex flex-col min-h-[428px] justify-between h-full">
              {recommended && (
                <div className="self-center h-7">
                  <Button
                    className="rounded-3xl relative -right-20 -top-4 text-black bg-black"
                    size="sm"
                  >
                    <text className="text-xs text-[#73D08D] font-bold">
                      MOST POPULAR
                    </text>
                  </Button>
                </div>
              )}
              <h2 className="mb-5 text-4xl font-bold text-left text-[#73D08D]">
                {price ? (
                  <>
                    <text className="font-bold text-4xl text-[#73D08D]">
                      ${price}
                    </text>
                    <text className=" text-lg font- text-white"> /month</text>
                  </>
                ) : (
                  "Free"
                )}
              </h2>
              <div className="mb-2 flex items-end text-2xl font-medium text-[#73D08D]">
                {name}{" "}
              </div>
              <p className="mb-5 text-left text-white">{description}</p>
              <div className="mb-10 flex flex-col gap-y-2">
                {features.map((feature) => (
                  <div
                    className="flex items-center gap-2 w-full mb-2"
                    key={feature}
                  >
                    <CheckCircle size={20} className="w-1/10" />
                    <p className="ml-3 overflow-auto w-4/5 text-left text-white">
                      {feature}
                      {feature.includes("Mobile") && (
                        <span className="text-left text-[#808080] text-sm italic font-thin">
                          {" "}
                          Beta
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-left mb-8 text-white">
                {percentFee}% Transaction Fees
              </p>
              <Button
                className={`rounded-3xl relative bottom-3 bg-[#73D08D] text-black`}
                size="lg"
              >
                <text className="px-4">{btnText}</text>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex min-h-[428px] shadow-2xl shadow-[#78df95] md:w-96 full flex-col rounded-3xl p-8 md:relative bottom-6 bg-[#73D08D] ">
            <div className="ml-4 flex flex-col min-h-[428px] justify-between h-full">
              {recommended && (
                <div className="self-center h-7">
                  <Button
                    className="rounded-3xl relative -right-20 -top-4 text-black bg-black"
                    size="sm"
                  >
                    <text className="text-xs text-[#73D08D] font-bold">
                      MOST POPULAR
                    </text>
                  </Button>
                </div>
              )}
              <h2 className="mb-5 text-4xl font-bold text-left text-black">
                {price ? (
                  <>
                    <text className="font-bold text-4xl text-black">
                      ${price}
                    </text>
                    <text className=" text-lg font-normal text-black">
                      {" "}
                      /month
                    </text>
                  </>
                ) : (
                  "Free"
                )}
              </h2>
              <div className="mb-2 flex items-end text-2xl font-medium text-black">
                {name}{" "}
              </div>
              <p className="mb-5 text-left text-black">{description}</p>
              <div className="mb-10 flex flex-col gap-y-2">
                {features.map((feature) => (
                  <div
                    className="flex items-center gap-2 w-full mb-2"
                    key={feature}
                  >
                    <CheckCircle size={20} className="w-1/10 text-black" />
                    <p className="ml-3 overflow-auto w-4/5 text-left text-black">
                      {feature}
                      {feature.includes("Mobile") && (
                        <span className="text-left text-[#808080] text-sm italic font-thin">
                          {" "}
                          Beta
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-left mb-8 text-black">
                {percentFee}% Transaction Fees
              </p>
              <Button
                className={`rounded-3xl relative bottom-3 bg-black text-white hover:bg-opacity-80 hover:bg-black`}
                size="lg"
              >
                <text className="px-4">{btnText}</text>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
