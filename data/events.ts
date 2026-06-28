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
  metaImagePath?: string;
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
    captionTemplate: `𝗦𝘁𝗲𝗽𝗽𝗶𝗻𝗴 𝗶𝗻𝘁𝗼 𝘁𝗵𝗲 𝗖𝗢𝗦𝗠𝗢𝗦! 🚀☁️

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
  {
    id: "sparkfest",
    slug: "sparkfest",
    title: "SparkFest DP Blast",
    description:
      "The blueprint is set, the coordinates are locked, and the grid is loading. SparkFest 2026 is the ultimate convergence point where pixelated concepts transform into groundbreaking tech. We are standing at the ultimate crossroads of innovation, where physical limits fade and digital horizons expand. It's time to Shift Realities & Build the Future. \n\nUse this frame to celebrate SparkFest 2026! Customize your profile picture with the event overlay and share it on social media to show that you are officially stepping into the final dimension.",
    creator: "Google Developer Groups on Campus PUP",
    captionTemplate: `[ 📍  𝙒𝘼𝙔𝙋𝙊𝙄𝙉𝙏 𝙍𝙀𝘼𝘾𝙃𝙀𝘿: 𝙀𝙉𝙏𝙀𝙍𝙄𝙉𝙂 𝙏𝙃𝙀 𝙁𝙄𝙉𝘼𝙇 𝘿𝙄𝙈𝙀𝙉𝙎𝙄𝙊𝙉 ]

The blueprint is set, the coordinates are locked, and the grid is loading. 🌐✨ 

We are standing at the ultimate crossroads of innovation, where physical limits fade and digital horizons expand. It's time to 𝗦𝗵𝗶𝗳𝘁 𝗥𝗲𝗮𝗹𝗶𝘁𝗶𝗲𝘀 & 𝗕𝘂𝗶𝗹𝗱 𝘁𝗵𝗲 𝗙𝘂𝘁𝘂𝗿𝗲. ⚡️ 

I am {{name}}, and I am officially stepping into 𝗦𝗽𝗮𝗿𝗸𝗙𝗲𝘀𝘁 𝟮𝟬𝟮𝟲! The ultimate convergence point where pixelated concepts transform into groundbreaking tech. 💻👾 

As dimensions collide, 𝗼𝘂𝗿 𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗶𝘀 𝗰𝗹𝗲𝗮𝗿: 𝘄𝗿𝗶𝘁𝗲 𝘁𝗵𝗲 𝗰𝗼𝗱𝗲, 𝗯𝗿𝗶𝗱𝗴𝗲 𝘁𝗵𝗲 𝗴𝗮𝗽, 𝗮𝗻𝗱 𝘀𝘁𝗮𝗯𝗶𝗹𝗶𝘇𝗲 𝘁𝗵𝗲 𝗰𝗼𝗻𝘃𝗲𝗿𝗴𝗲𝗻𝗰𝗲. We're breaking down the boundaries of the digital canvas, rendering our boldest ideas block by block, and navigating the ultimate tech landscape. No bugs can block our path, and no limit can contain our dimensions. 💥 

𝗔𝗿𝗲 𝘆𝗼𝘂 𝗿𝗲𝗮𝗱𝘆 𝘁𝗼 𝗳𝗶𝗻𝗱 𝘆𝗼𝘂𝗿 𝘄𝗮𝘆𝗽𝗼𝗶𝗻𝘁 𝗮𝗻𝗱 𝗴𝗲𝘁 𝗯𝗮𝗰𝗸 𝘁𝗵𝗲 𝗺𝗮𝘁𝗿𝗶𝘅? See you on the grid, Sparkmates! 

📌 𝐃𝐏 𝐅𝐑𝐀𝐌𝐄 𝐇𝐄𝐑𝐄:
🔗 https://frame.gdgpup.org/events/sparkfest/

📘 𝐄𝐯𝐞𝐧𝐭 𝐏𝐫𝐢𝐦𝐞𝐫:
⛓️‍💥 https://tinyurl.com/mtud86em

👉 𝐕𝐢𝐬𝐢𝐭 𝐎𝐮𝐫 𝐖𝐞𝐛𝐬𝐢𝐭𝐞:
⛓️‍💥 https://sparkfest.gdgpup.org

𝐈𝐧 𝐂𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐢𝐨𝐧 𝐰𝐢𝐭𝐡
- PUP PYLON TBI
𝐋𝐨𝐧𝐠 𝐓𝐞𝐫𝐦 𝐃𝐢𝐚𝐦𝐨𝐧𝐝 𝐒𝐩𝐨𝐧𝐬𝐨𝐫
- OpsWerks
𝐄𝐯𝐞𝐧𝐭 𝐆𝐨𝐥𝐝 𝐒𝐩𝐨𝐧𝐬𝐨𝐫
- Emapta
- Circuitrocks
- Ms. Armielyn Obinguar 
𝐋𝐨𝐧𝐠 𝐓𝐞𝐫𝐦 𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲 𝐏𝐚𝐫𝐭𝐧𝐞𝐫
-Seekers Guild

✍🏽 Spiel by 𝘌𝘵𝘩𝘢𝘯𝘪𝘦𝘭 𝘚𝘢𝘭𝘦𝘴
🖼️ Poster by 𝘝𝘪𝘯𝘤𝘦 𝘋𝘦𝘭𝘪𝘨𝘦𝘯𝘵𝘦
🧮 Assets by 𝘈𝘭𝘦𝘤𝘻𝘢 𝘉𝘰𝘯𝘪𝘧𝘢𝘤𝘪𝘰, 𝘊𝘺𝘳𝘶𝘻 𝘈𝘳𝘤𝘢𝘯, 𝘙𝘦𝘪𝘯𝘸𝘢𝘭𝘥 𝘔𝘢𝘳𝘰𝘯𝘦 𝘝𝘢𝘭𝘦𝘻𝘢, 𝘑𝘰𝘴𝘩𝘶𝘢 𝘙𝘦𝘯𝘰𝘷𝘢𝘭𝘦𝘴, 𝘒𝘦𝘯𝘯𝘦𝘵𝘩 𝘔𝘢𝘳𝘲𝘶𝘦𝘻

#SparkFest2026
#TheGDGWay
#SparkTheDimension 
#OpsWerksTheAcademy
#CircuitRocks
#Empata`,
    coverImagePath: "/sparkfest_dp_blast.png",
    frames: [
      {
        id: "sparkfest-frame",
        name: "SparkFest Frame",
        overlayPath: "/sparkfest_dp_blast.png",
        thumbnailPath: "/sparkfest_dp_blast.png",
      },
    ],
    externalLink: "https://sparkfest.gdgpup.org",
  },
];

export const getEventBySlug = (slug: string) =>
  events.find((item) => item.slug === slug);
