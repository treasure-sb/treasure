import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function EventGuests() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="guests">
          Do you have any special guests to highlight?
        </Label>
        <Switch id="guests" />
      </div>
    </div>
  );
}
