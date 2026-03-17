export const SLIDES = [
  {
    id: "kevin-story",
    title: "Kevin Just Wants To Use The Internet",
    subtitle:
      "Kevin is a businessman who uses the internet to run everyday tasks. One of those tasks is accessing eCitizen, but he is not cyberaware.",
    bullets: [
      "He goes online to communicate, make payments, manage accounts, and handle business tasks",
      "eCitizen is just one of the online services he depends on",
      "He trusts links, pop-ups, and urgent prompts too easily",
      "One careless click can expose his identity, passwords, and payments"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image2.png", alt: "Kevin trying to access digital services" },
    stage: {
      cameraPos: [0.1, 1.3, 4.9],
      cameraTarget: [0, 1.05, 0],
      keyLight: 3.7,
      rimLight: 2.5,
      haze: 0.1,
      panelSpread: 0.72
    }
  },
  {
    id: "risk",
    title: "The Risk Is Everyday Digital Use",
    subtitle:
      "As Kevin uses the internet for normal business activities, including eCitizen, he can run into phishing pages, weak-password habits, and social engineering without realizing it.",
    bullets: [
      "The threat appears inside normal daily workflows",
      "Most users are told to be careful, but never shown how to respond safely",
      "Cyber awareness has to feel practical, local, and immediate"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image5.png", alt: "Cyber risks during normal online activity" },
    stage: {
      cameraPos: [-0.2, 1.45, 4.55],
      cameraTarget: [0.05, 1.04, 0],
      keyLight: 4.1,
      rimLight: 2.9,
      haze: 0.08,
      panelSpread: 0.88
    }
  },
  {
    id: "solution",
    title: "Solution: CYBERVERSE",
    subtitle:
      "CYBERVERSE is a gamified cybersecurity training platform that places users inside realistic digital situations and teaches them how to respond safely in real time.",
    bullets: [
      "It simulates the exact moments where users get tricked, such as phishing links, fake login pages, and unsafe account actions",
      "Inside the 3D environment, the learner explores, makes choices, and sees instant consequences and guided correction",
      "It is designed for practical awareness, so people like Kevin can build habits they will use on eCitizen and other everyday services",
      "NURU A.I and the mission system turn cyber education from advice into hands-on practice"
    ],
    cta: { label: "GameJolt Demo", href: "https://gamejolt.com/games/CYBERVERSEKE/1032684" },
    mediaPos: "right",
    media: {
      type: "gallery",
      items: [
        { src: "/assets/image8.png", alt: "CYBERVERSE simulation overview", caption: "3D simulation environment" },
        { src: "/assets/image5.png", alt: "CYBERVERSE training mission", caption: "Interactive cyber missions" },
        { src: "/assets/image6.png", alt: "NURU AI assistance", caption: "Guidance from NURU A.I" },
        { src: "/assets/image2.png", alt: "Cyber awareness scenario", caption: "Local, real-world awareness scenarios" }
      ]
    },
    stage: {
      cameraPos: [0.3, 1.18, 4.15],
      cameraTarget: [0, 1.01, 0],
      keyLight: 4.4,
      rimLight: 3.2,
      haze: 0.06,
      panelSpread: 0.66
    }
  },
  {
    id: "nuru",
    layout: "center",
    title: "",
    subtitle: "",
    bullets: [],
    sequence: {
      type: "ai_click",
      todayTitle: "This is what A.I looks like today",
      todaySubtitle: "The major problem is that most of it is only text-based, and most people would have it like this.",
      todayImage: "/assets/image7.jpg",
      todayAlt: "Typical chatbot UI",
      bridgeTitle: "Now imagine what they are going to look like tomorrow: more human, more visual, and able to guide you in real time",
      bridgeSubtitle: "Finally, meet",
      nuruText: "NURU A.I",
      tomorrowImage: "/assets/image4.png",
      tomorrowAlt: "NURU A.I",
      demoTitle: "Demo"
    },
    stage: {
      cameraPos: [0, 1.42, 4.65],
      cameraTarget: [0, 1.02, 0],
      keyLight: 4.8,
      rimLight: 3.6,
      haze: 0.05,
      panelSpread: 1.02
    }
  }
];
