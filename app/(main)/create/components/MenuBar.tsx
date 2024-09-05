import { Button } from "@/components/ui/button";

const ProgressBar = () => {
  return (
    <div className="flex h-1.5">
      <div className="w-full bg-primary" />
      <div className="w-full bg-gray-300" />
      <div className="w-full bg-gray-300" />
    </div>
  );
};

export default function MenuBar() {
  return (
    <div className="-mx-4 sm:-mx-8 w-full bg-background fixed bottom-0">
      <ProgressBar />
      <div className="px-0 py-0 flex space-x-0 h-12">
        <Button
          type="button"
          variant={"tertiary"}
          className="w-full h-full rounded-none"
        >
          Save Draft
        </Button>
        <Button
          type="button"
          variant={"default"}
          className="w-full h-full rounded-none"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
