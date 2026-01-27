import { FloatingDock } from "@/components/ui/floating-dock";

export default function Home() {
  const links = [
    {
      title: "Home",
      icon: <span className="text-[10px] font-medium font-[family-name:var(--font-inter)] tracking-wide">HOME</span>,
      href: "/",
    },
    {
      title: "Work",
      icon: <span className="text-[10px] font-medium font-[family-name:var(--font-inter)] tracking-wide">WORK</span>,
      href: "/work",
    },
    {
      title: "Archive",
      icon: <span className="text-[10px] font-medium font-[family-name:var(--font-inter)] tracking-wide">ARCHIVE</span>,
      href: "/archive",
    },
    {
      title: "Play",
      icon: <span className="text-[10px] font-medium font-[family-name:var(--font-inter)] tracking-wide">PLAY</span>,
      href: "/play",
    },
    {
      title: "About",
      icon: <span className="text-[10px] font-medium font-[family-name:var(--font-inter)] tracking-wide">ABOUT</span>,
      href: "/about",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
