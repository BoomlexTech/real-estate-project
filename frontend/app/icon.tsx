import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const logoData = readFileSync(join(process.cwd(), "public", "logo2.png"));
  const base64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={base64}
          style={{
            width: "180%",
            height: "180%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    size
  );
}
