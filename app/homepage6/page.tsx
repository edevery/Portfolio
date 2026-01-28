import HomepageLayout from "@/components/ui/homepage-layout";
import EmilyMsdfCanvasV3 from "@/components/ui/emily-msdf-canvas-v3";

export default function Homepage6() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV3 circleSize={0.35} circleEdge={0.55} borderSize={0.45} />
    </HomepageLayout>
  );
}
