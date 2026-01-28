import EmilyCanvas from "@/components/ui/emily-canvas";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <EmilyCanvas width={1600} height={900} />
    </div>
  );
}
