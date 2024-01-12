import MobileHeaderOptions from "./MobileHeaderOptions";
import HeaderAvatar from "./HeaderAvatar";

export default function MobileHeader() {
  return (
    <div className="flex justify-between items-center md:hidden">
      <MobileHeaderOptions />
      <HeaderAvatar />
    </div>
  );
}
