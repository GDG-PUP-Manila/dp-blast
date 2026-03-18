export type FrameItem = {
  id: string;
  name: string;
  overlayPath: string;
  thumbnailPath: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  creator: string;
  captionTemplate: string;
  coverImagePath: string;
  frames: FrameItem[];
  externalLink?: string;
};

export const events: EventItem[] = [
  {
    id: "cosmos",
    slug: "cosmos",
    title: "Cosmos DP Blast",
    description:
      "Use this frame to celebrate the Cosmos DP Blast event! Customize your profile picture with the cosmic-themed overlay and share it on social media to show your support for the event.",
    creator: "GDG PUP",
    captionTemplate:
      "Cosmos DP Blast\n\nI am {{name}} and I am joining the Cosmos DP Blast celebration.\n\n#CosmosDPBlast #DPBlast",
    coverImagePath: "/cosmos_dp_blast.png",
    frames: [
      {
        id: "cosmos-frame",
        name: "Cosmos Frame",
        overlayPath: "/cosmos_dp_blast.png",
        thumbnailPath: "/cosmos_dp_blast.png",
      },
    ],
    externalLink:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-polytechnic-university-of-the-philippines-manila-philippines-presents-cosmos-2026-exploring-infinite-possibilities-through-technology-and-innovation/",
  },
];

export const getEventBySlug = (slug: string) =>
  events.find((item) => item.slug === slug);
