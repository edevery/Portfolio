import HomepageLayout from "@/components/ui/homepage-layout";
import EmilySdfCanvas from "@/components/ui/emily-sdf-canvas";

export default function Homepage2() {
  return (
    <HomepageLayout>
      <EmilySdfCanvas circleSize={0.3} circleEdge={0.15} borderSize={0.45} />
    </HomepageLayout>
  );
}
