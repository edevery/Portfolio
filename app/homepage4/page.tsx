import HomepageLayout from "@/components/layout/homepage-layout";
import EmilyMsdfCanvasV1 from "@/components/canvas/emily-msdf-canvas-v1";

export default function Homepage4() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV1 circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
    </HomepageLayout>
  );
}
