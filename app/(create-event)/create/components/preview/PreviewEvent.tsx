import EventPoster from "@/components/events/shared/EventPoster";
import Tags from "@/app/(event-page)/events/[name]/components/Tags";
import EventInfo from "@/app/(event-page)/events/[name]/components/sections/EventInfo";
import About from "@/app/(event-page)/events/[name]/components/sections/About";
import VenueMap from "@/app/(event-page)/events/[name]/components/sections/VenueMap";
import HostedBy from "./HostedBy";
import Blurred from "@/app/(event-page)/events/[name]/components/Blurred";
import { sectionVariants } from "../CreateEventFormSections";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../schema";
import { cn } from "@/lib/utils";

export default function PreviewEvent() {
  const form = useFormContext<CreateEvent>();
  const { basicDetails, tags, dates, venueMap, poster } = form.getValues();

  const filteredDates = dates.filter(
    (date): date is { startTime: string; endTime: string; date: Date } =>
      date.date !== undefined
  );

  const formattedDates = filteredDates.map((date) => {
    return {
      date: format(date.date, "yyyy-MM-dd"),
      start_time: date.startTime,
      end_time: date.endTime,
    };
  });

  return (
    <div className="relative">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sectionVariants}
        className="md:max-w-[1160px] mx-auto flex flex-col md:flex-row md:justify-between md:space-x-14 mt-12 pb-20 md:pb-40"
      >
        <div className="relative w-full md:w-auto">
          <div className="md:sticky md:top-12 md:h-fit">
            <div className="mb-6 w-full max-w-xl relative z-10 mx-auto">
              <EventPoster posterUrl={poster} />
            </div>
          </div>
        </div>
        <div className="text-left w-full max-w-xl md:max-w-2xl mx-auto relative z-20 space-y-3">
          <div className="mb-8 md:mb-12 text-foreground/80">
            <div className="space-y-4 md:space-y-5">
              <h1
                className={cn(
                  "text-4xl md:text-5xl font-semibold",
                  !basicDetails.name ? "italic" : "text-foreground"
                )}
              >
                {basicDetails.name || "Event Name"}
              </h1>
              {tags.length > 0 ? (
                <Tags tags={tags} />
              ) : (
                <p className="italic">No tags provided.</p>
              )}
              {filteredDates.length > 0 && basicDetails.venueAddress ? (
                <EventInfo
                  dates={formattedDates}
                  venueName={basicDetails.venueName}
                  address={basicDetails.venueAddress.address}
                />
              ) : (
                <p className="italic">Date and address not provided.</p>
              )}
            </div>
            <div className="my-8 md:my-12 space-y-8 rounded-2xl border-[1px] border-foreground/10 bg-slate-500/10 bg-opacity-20 py-5 px-6 z-10"></div>
          </div>
          <About description={basicDetails.description} />
          {venueMap && (
            <VenueMap venueMap={null} venueMapPublicUrl={venueMap} />
          )}
          <HostedBy />
        </div>
      </motion.div>
      <Blurred posterUrl={poster} />
    </div>
  );
}
