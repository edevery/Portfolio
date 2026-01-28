import HomepageLayout from "@/components/layout/homepage-layout";
import EmilySdfCanvas from "@/components/canvas/emily-sdf-canvas";

export default function Homepage2() {
  return (
    <HomepageLayout>
      <EmilySdfCanvas circleSize={0.3} circleEdge={0.15} borderSize={0.45} />
    </HomepageLayout>
  );
}
