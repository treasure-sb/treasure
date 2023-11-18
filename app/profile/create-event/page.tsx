"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { createEvent } from "@/lib/actions/events";
import { eventFormSchema } from "@/lib/schemas/events";

interface Step1Props {
  onNext: () => void;
}

// interface Step2Props {
//   onNext: () => void;
//   onBack: () => void;
// }

// interface Step3Props {
//   onNext: () => void;
//   onBack: () => void;
// }

function Step1({ onNext }: Step1Props) {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
  });

  const onSubmit = async () => {
    await createEvent(form.getValues());
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Event Name" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Small Description" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Venue Name" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Venue Address" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ticket Price" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ticket Quantity" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full py-6 mt-20">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}

// function Step2({ onNext, onBack }: Step2Props) {
//   return (
//     <div>
//       <h1>Step 2</h1>
//       <div className="w-full flex space-x-4 absolute bottom-0">
//         <Button className="w-full" onClick={onBack}>
//           Back
//         </Button>
//         <Button className="w-full" onClick={onNext}>
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

// function Step3({ onNext, onBack }: Step2Props) {
//   return (
//     <div>
//       <h1>Step 3</h1>
//       <div className="w-full flex space-x-4 absolute bottom-0">
//         <Button className="w-full" onClick={onBack}>
//           Back
//         </Button>
//         <Button className="w-full" onClick={onNext}>
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

export default function Page() {
  const [step, setStep] = useState(1);

  return (
    <main className="max-w-lg h-[calc(100vh-120px)] m-auto">
      <h1 className="text-3xl font-semibold mb-6">Create Event</h1>
      {step === 1 && <Step1 onNext={() => setStep(step + 1)} />}
      {/* {step === 2 && (
        <Step2
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 3 && (
        <Step3
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )} */}
    </main>
  );
}
