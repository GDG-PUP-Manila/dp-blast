import type { APIRoute } from "astro";
import sharp from "sharp";
import { getEventBySlug } from "../../../../data/events";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const wrapText = (value: string, maxLen: number, maxLines: number) => {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLen) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
    } else {
      lines.push(word.slice(0, maxLen));
      current = word.slice(maxLen);
    }

    if (lines.length === maxLines) {
      return lines;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  return lines;
};

const buildOverlaySvg = (title: string, creator: string) => {
  const titleLines = wrapText(title.toUpperCase(), 26, 2);
  const safeCreator = escapeXml(creator);

  const renderedTitle = titleLines
    .map((line, index) => {
      const y = 438 + index * 58;
      return `<text x="72" y="${y}" fill="#ffffff" font-size="54" font-family="Outfit, Segoe UI, Arial, sans-serif" font-weight="800">${escapeXml(line)}</text>`;
    })
    .join("");

  return `
  <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topWash" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0.06)"/>
        <stop offset="70%" stop-color="rgba(0,0,0,0.5)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.78)"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#topWash)" />

    <rect x="72" y="72" width="174" height="42" rx="21" fill="#4285f4" />
    <text x="159" y="100" text-anchor="middle" fill="#ffffff" font-size="20" font-family="Outfit, Segoe UI, Arial, sans-serif" font-weight="700">DP BLAST</text>

    ${renderedTitle}

    <text x="72" y="564" fill="#dfe7ff" font-size="28" font-family="Outfit, Segoe UI, Arial, sans-serif" font-weight="600">By ${safeCreator}</text>
  </svg>`;
};

export const GET: APIRoute = async ({ params, request }) => {
  const eventSlug = params.eventSlug ?? "";
  const event = getEventBySlug(eventSlug);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const fallbackSource = event.frames[0]?.overlayPath ?? "/logo.png";
  const sourcePath = event.coverImagePath || fallbackSource;

  let baseImageBuffer: Buffer;

  try {
    const imageResponse = await fetch(new URL(sourcePath, request.url));
    if (!imageResponse.ok) {
      throw new Error("source-image-not-found");
    }

    const sourceBuffer = Buffer.from(await imageResponse.arrayBuffer());
    baseImageBuffer = await sharp(sourceBuffer)
      .resize(OG_WIDTH, OG_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();
  } catch {
    baseImageBuffer = await sharp({
      create: {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        channels: 3,
        background: { r: 32, g: 37, b: 48 },
      },
    })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
  }

  const overlaySvg = buildOverlaySvg(event.title, event.creator);

  const output = await sharp(baseImageBuffer)
    .composite([
      {
        input: Buffer.from(overlaySvg),
        blend: "over",
      },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(output), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "Content-Disposition": `inline; filename="${event.slug}-og.jpg"`,
    },
  });
};
