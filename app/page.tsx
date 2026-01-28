import HomepageLayout from "@/components/layout/homepage-layout";
import EmilyMsdfCanvasV5 from "@/components/canvas/emily-msdf-canvas-v5";

export default function Home() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvasV5 circleSize={0.25} circleEdge={0.3} borderSize={0.45} />
    </HomepageLayout>
  );
}
