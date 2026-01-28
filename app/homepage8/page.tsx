import HomepageLayout from "@/components/ui/homepage-layout";
import EmilyMsdfCanvasV5 from "@/components/ui/emily-msdf-canvas-v5";

export default function Homepage8() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV5 circleSize={0.25} circleEdge={0.3} borderSize={0.45} />
    </HomepageLayout>
  );
}
