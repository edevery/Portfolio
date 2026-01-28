import HomepageLayout from "@/components/layout/homepage-layout";
import EmilyMsdfCanvasV2 from "@/components/canvas/emily-msdf-canvas-v2";

export default function Homepage5() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV2 circleSize={0.35} circleEdge={0.55} borderSize={0.45} />
    </HomepageLayout>
  );
}
