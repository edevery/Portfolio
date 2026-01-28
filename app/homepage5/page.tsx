import HomepageLayout from "@/components/ui/homepage-layout";
import EmilyMsdfCanvasV2 from "@/components/ui/emily-msdf-canvas-v2";

export default function Homepage5() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV2 circleSize={0.35} circleEdge={0.55} borderSize={0.45} />
    </HomepageLayout>
  );
}
