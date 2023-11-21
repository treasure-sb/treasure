import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <div className="w-full my-20 space-y-6 max-w-4xl m-auto">
      <h1 className="text-center text-3xl font-bold underline leading-relaxed md:text-5xl">
        THE TRI-STATE’S TOP COLLECTOR EVENTS SENT STRAIGHT TO YOUR INBOX
      </h1>
      <h1 className="text-center">
        One message a week on Sunday - so you never miss an event near you.
      </h1>
      <Input className="max-w-lg m-auto" placeholder="Email" />
    </div>
  );
}
