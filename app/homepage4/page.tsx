import { FloatingDock } from "@/components/ui/floating-dock";
import EmilyMsdfCanvasV1 from "@/components/ui/emily-msdf-canvas-v1";

export default function Homepage4() {
  const links = [
    {
      title: "Home",
      icon: <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">Home</span>,
      href: "/",
    },
    {
      title: "Work",
      icon: <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">Work</span>,
      href: "/work",
    },
    {
      title: "Archive",
      icon: <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">Archive</span>,
      href: "/archive",
    },
    {
      title: "Play",
      icon: <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">Play</span>,
      href: "/play",
    },
    {
      title: "About",
      icon: <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">About</span>,
      href: "/about",
    },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-[1600px] h-[900px]">
        <EmilyMsdfCanvasV1 circleSize={0.3} circleEdge={0.5} borderSize={0.45} />
      </div>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
