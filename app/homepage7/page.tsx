import HomepageLayout from "@/components/layout/homepage-layout";
import EmilyMsdfCanvasV4 from "@/components/canvas/emily-msdf-canvas-v4";

export default function Homepage7() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV4 circleSize={0.25} circleEdge={0.3} borderSize={0.45} />
    </HomepageLayout>
  );
}
