import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function EventHighlights() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="highlights">Do you have any images to highlight?</Label>
        <Switch id="highlights" />
      </div>
    </div>
  );
}
