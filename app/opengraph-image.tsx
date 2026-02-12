import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "edevery. — Emily Devery, Designer & Art Director";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontBold = await readFile(
    join(process.cwd(), "public/Fonts/Neue Haas Grotesk/NHaasGroteskDSPro-75Bd.otf")
  );
  const fontRegular = await readFile(
    join(process.cwd(), "public/Fonts/Neue Haas Grotesk/NHaasGroteskDSPro-55Rg.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#000",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: "NHaasGrotesk Bold",
            color: "#fff",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          edevery.
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: "NHaasGrotesk",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          Designing at the intersection of brand, product, and emerging technology
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            fontSize: 22,
            fontFamily: "NHaasGrotesk",
            color: "#85c3ed",
          }}
        >
          Emily Devery — Designer & Art Director
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
