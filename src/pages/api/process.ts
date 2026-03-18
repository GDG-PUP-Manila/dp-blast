import type { APIRoute } from "astro";
import sharp from "sharp";
import { getEventBySlug } from "../../../data/events";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_OUTPUT_EDGE = 2048;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const json = (status: number, message: string) =>
  new Response(JSON.stringify({ ok: false, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const photo = formData.get("photo");
    const eventSlug = formData.get("eventSlug");
    const frameId = formData.get("frameId");

    if (typeof eventSlug !== "string" || !eventSlug.trim()) {
      return json(400, "Missing event slug.");
    }

    if (typeof frameId !== "string" || !frameId.trim()) {
      return json(400, "Missing frame identifier.");
    }

    const event = getEventBySlug(eventSlug);
    if (!event) {
      return json(400, "Invalid event slug.");
    }

    const selectedFrame = event.frames.find((frame) => frame.id === frameId);
    if (!selectedFrame) {
      return json(400, "Invalid frame for selected event.");
    }

    if (!(photo instanceof File)) {
      return json(400, "Please upload a valid image file.");
    }

    if (!ALLOWED_MIME_TYPES.has(photo.type)) {
      return json(400, "Unsupported file type. Please use PNG, JPG, or WEBP.");
    }

    if (photo.size > MAX_UPLOAD_BYTES) {
      return json(413, "File is too large. Maximum size is 10MB.");
    }

    const inputBuffer = Buffer.from(await photo.arrayBuffer());

    // Fetch the frame from public assets so it works in both dev and production.
    const frameResponse = await fetch(
      new URL(selectedFrame.overlayPath, request.url),
    );
    if (!frameResponse.ok) {
      return json(500, "Frame asset is unavailable.");
    }

    const frameBuffer = Buffer.from(await frameResponse.arrayBuffer());
    const frameMetadata = await sharp(frameBuffer).metadata();

    if (!frameMetadata.width || !frameMetadata.height) {
      return json(500, "Frame metadata is invalid.");
    }

    const scaleFactor = Math.min(
      1,
      MAX_OUTPUT_EDGE / Math.max(frameMetadata.width, frameMetadata.height),
    );
    const targetWidth = Math.max(
      1,
      Math.round(frameMetadata.width * scaleFactor),
    );
    const targetHeight = Math.max(
      1,
      Math.round(frameMetadata.height * scaleFactor),
    );

    const resizedFrameBuffer = await sharp(frameBuffer)
      .resize(targetWidth, targetHeight, {
        fit: "fill",
      })
      .png()
      .toBuffer();

    const baseImage = await sharp(inputBuffer)
      .rotate()
      .resize(targetWidth, targetHeight, {
        fit: "cover",
        position: "centre",
      })
      .removeAlpha()
      .toColorspace("srgb")
      .png({ compressionLevel: 9 })
      .toBuffer();

    const output = await sharp(baseImage)
      .composite([{ input: resizedFrameBuffer, blend: "over" }])
      .png({ compressionLevel: 9 })
      .toBuffer();

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Content-Disposition": 'inline; filename="dp-blast-output.png"',
      },
    });
  } catch {
    return json(500, "Unexpected processing error. Please try again.");
  }
};
