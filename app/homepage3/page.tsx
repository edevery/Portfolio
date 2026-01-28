import HomepageLayout from "@/components/layout/homepage-layout";
import EmilyMsdfCanvas from "@/components/canvas/emily-msdf-canvas";

export default function Homepage3() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvas circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
    </HomepageLayout>
  );
}
