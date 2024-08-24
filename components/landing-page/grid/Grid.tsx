import Map from "./Map";
import Send from "./Send";
import Showcase from "./Showcase";

export default function Grid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Showcase />
      <Send />
      <Map />
    </div>
  );
}
