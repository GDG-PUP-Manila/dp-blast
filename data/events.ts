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
      "Join us for COSMOS 2026, a groundbreaking event designed to immerse students at Polytechnic University of the Philippines in the world of cutting-edge technology and innovation. As part of our commitment to empowering the next generation of tech leaders, this summit will provide an unparalleled opportunity to connect with industry experts and explore the latest advancements in AI, cloud computing, and development tools. \n\nUse this frame to celebrate the Cosmos DP Blast event! Customize your profile picture with the cosmic-themed overlay and share it on social media to show your support for the event.",
    creator: "Google Developer Groups on Campus PUP",
    captionTemplate: 
`𝗦𝘁𝗲𝗽𝗽𝗶𝗻𝗴 𝗶𝗻𝘁𝗼 𝘁𝗵𝗲 𝗖𝗢𝗦𝗠𝗢𝗦! 🚀☁️

Exploring the infinite possibilities through technology and innovation at GDG PUP’s 𝗖𝗢𝗦𝗠𝗢𝗦 𝟮𝟬𝟮𝟲 happening this 𝗠𝗮𝗿𝗰𝗵 𝟮𝟰⚡️

I am {{name}} 👨‍🚀, ready to be part of a community where ideas connect, sparks align, and we navigate the future of technology together.

Join us and be part of the cosmic journey, diving into a space filled with learning, collaboration, and new perspectives, pushing boundaries and discovering what lies beyond! 🪐

🟡 March 24, 2026
🔵 Bulwagang Balagtas
🟢 9:00 AM - 5:00 PM
🔴 Open to ALL PUP Students

𝐔𝐬𝐞 𝐨𝐮𝐫 𝐃𝐏 𝐁𝐥𝐚𝐬𝐭 𝐅𝐫𝐚𝐦𝐞:
🔗 https://frame.gdgpup.org/events/cosmos/
🔗 https://frame.gdgpup.org/events/cosmos/
🔗 https://frame.gdgpup.org/events/cosmos/

See you there, Sparkmates!

#GDGPUP26
#BeSuperWithGDG
#GDGCOSMOS2026

✍️ Spiel by 𝘋𝘦𝘯𝘪𝘴𝘴𝘦 𝘒𝘢𝘳𝘪𝘮
🖼️ Poster by 𝘔𝘦𝘨 𝘔𝘰𝘳𝘵𝘦𝘭
🧮 Assets by 𝘙𝘦𝘪𝘯𝘸𝘢𝘭𝘥 𝘝𝘢𝘭𝘦𝘻𝘢, 𝘙𝘦𝘪𝘯 𝘍𝘶𝘳𝘢𝘨𝘢𝘯𝘯𝘢𝘯, 𝘈𝘭𝘦𝘤𝘻𝘢 𝘉𝘰𝘯𝘪𝘧𝘢𝘤𝘪𝘰, 𝘑𝘰𝘴𝘩𝘶𝘢 𝘙𝘦𝘯𝘰𝘷𝘢𝘭𝘦𝘴 and 𝘒𝘦𝘯𝘯𝘦𝘵𝘩 𝘔𝘢𝘳𝘲𝘶𝘦𝘻`,
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
