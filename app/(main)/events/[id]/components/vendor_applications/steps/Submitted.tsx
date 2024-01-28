import { Button } from "@/components/ui/button";

export default function Submitted({
  handleOpenChange,
}: {
  handleOpenChange: () => void;
}) {
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Thank you</h1>
        <p className="text-primary">Your application has been submitted</p>
        <h1 className="text-xl font-semibold">What To Expect Next</h1>
        <ol className="space-y-4 list-decimal list-outside ml-5">
          <li>
            Once approved, we will text and email you a link to pay for your
            table(s)
          </li>
          <li>
            Please pay within 24 hours of apporval to guarantee table
            availability
          </li>
          <li>
            You will receive email confirmation of your table passes and will be
            featured as a vendor on the event page
          </li>
        </ol>
      </div>
      <Button onClick={() => handleOpenChange()}>Return to event page</Button>
    </>
  );
}
