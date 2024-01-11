import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default function Loading() {
  return (
    <main className="max-w-6xl m-auto flex justify-center items-center h-[calc(100vh-300px)]">
      <TreasureEmerald bounce={true} width={34} height={34} delay={0} />
      <TreasureEmerald bounce={true} width={34} height={34} delay={0.1} />
      <TreasureEmerald bounce={true} width={34} height={34} delay={0.2} />
    </main>
  );
}
