import { FloatingDock } from "@/components/ui/floating-dock";
import EmilyCanvas from "@/components/ui/emily-canvas";

export default function Home() {
  const links = [
    {
      title: "Home",
      icon: <span className="text-[10px] font-medium group-hover:font-extrabold transition-all duration-700 ease-out font-[family-name:var(--font-inter)] tracking-wider">Home</span>,
      href: "/",
      isActive: true,
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
      <EmilyCanvas width={1600} height={900} />
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
