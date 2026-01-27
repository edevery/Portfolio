import { FloatingDock } from "@/components/ui/floating-dock";
import { Container } from "@/components/ui/container";

export default function Home() {
  const links = [
    {
      title: "Home",
      icon: <span className="text-sm font-medium">HOME</span>,
      href: "/",
    },
    {
      title: "Work",
      icon: <span className="text-sm font-medium">WORK</span>,
      href: "/work",
    },
    {
      title: "Archive",
      icon: <span className="text-sm font-medium">ARCHIVE</span>,
      href: "/archive",
    },
    {
      title: "Play",
      icon: <span className="text-sm font-medium">PLAY</span>,
      href: "/play",
    },
    {
      title: "About",
      icon: <span className="text-sm font-medium">ABOUT</span>,
      href: "/about",
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 flex items-center justify-center pb-24">
        <Container className="flex items-center justify-center">
          <h1
            className="text-white text-[8rem] md:text-[14rem] lg:text-[20rem] tracking-tight"
            style={{ fontFamily: "'Noe Display', serif", fontStyle: "italic" }}
          >
            emily
          </h1>
        </Container>
      </main>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center font-[family-name:var(--font-inter)]">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
