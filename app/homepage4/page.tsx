import HomepageLayout from "@/components/ui/homepage-layout";
import EmilyMsdfCanvasV1 from "@/components/ui/emily-msdf-canvas-v1";

export default function Homepage4() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV1 circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
    </HomepageLayout>
  );
}
