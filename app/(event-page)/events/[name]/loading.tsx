import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default function Loading() {
  return (
    <main className="max-w-6xl m-auto flex justify-center items-center min-h-screen pb-40">
      <TreasureEmerald bounce={true} width={34} height={34} delay={0} />
      <TreasureEmerald bounce={true} width={34} height={34} delay={0.1} />
      <TreasureEmerald bounce={true} width={34} height={34} delay={0.2} />
    </main>
  );
}
