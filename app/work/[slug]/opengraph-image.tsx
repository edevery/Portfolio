import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getWorkItemBySlug, getAllSlugs } from "@/lib/work-data";

export const alt = "Case Study — Emily Devery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWorkItemBySlug(slug);

  const fontBold = await readFile(
    join(process.cwd(), "public/Fonts/Neue Haas Grotesk/NHaasGroteskDSPro-75Bd.otf")
  );
  const fontRegular = await readFile(
    join(process.cwd(), "public/Fonts/Neue Haas Grotesk/NHaasGroteskDSPro-55Rg.otf")
  );

  const title = item?.title ?? "Project";
  const description = item?.description ?? "";
  const accent = item?.accentColor ?? "#85c3ed";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#000",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Accent gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background: `linear-gradient(135deg, ${accent}22 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontFamily: "NHaasGrotesk Bold",
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: "NHaasGrotesk",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.4,
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          {description}
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: "NHaasGrotesk",
            color: accent,
          }}
        >
          Emily Devery
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "NHaasGrotesk Bold",
          data: fontBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "NHaasGrotesk",
          data: fontRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
