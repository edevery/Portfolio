import HomepageLayout from "@/components/ui/homepage-layout";
import EmilyMsdfCanvas from "@/components/ui/emily-msdf-canvas";

export default function Homepage3() {
  return (
    <HomepageLayout>
      <EmilyMsdfCanvas circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
    </HomepageLayout>
  );
}
