import Sales from "./components/Sales";
import Tables from "./components/Tables";

export default function Page() {
  return (
    <>
      <h1 className="font-semibold text-3xl mb-4">Vendor Overview</h1>
      <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 flex flex-col">
        {/* <UpcomingEvents /> */}
        {/* <Profit /> */}
        <Sales />
        <Tables />
        {/* <Tables /> */}
      </div>
    </>
  );
}
