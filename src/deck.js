export const SLIDES = [
  {
    id: "intro",
    title: "CYBERVERSE",
    subtitle: "AI-powered multiplayer cybersecurity simulation built in Unity.",
    bullets: [
      "Transforms cybersecurity education from passive theory to immersive missions",
      "Real-time behavioral feedback inside a 3D shared world",
      "Featuring NURU AI - a 3D embodied conversational cybersecurity agent"
    ],
    cta: { label: "GameJolt Demo", href: "https://gamejolt.com/games/CYBERVERSEKE/1032684" },
    mediaPos: "right",
    media: { type: "image", src: "/assets/image8.png", alt: "CYBERVERSE cover" },
    stage: {
      cameraPos: [0.2, 1.35, 5.2],
      cameraTarget: [0, 1.1, 0],
      keyLight: 2.2,
      rimLight: 1.4,
      haze: 0.18,
      panelSpread: 0.65
    }
  },
  {
    id: "problem",
    title: "Problem: Theory without practice",
    subtitle:
      "Kenya's digital services are growing fast, and cyber threats are rising just as quickly. Most learners still lack safe, hands-on labs.",
    bullets: [
      "Cybersecurity education is often PowerPoints and memorization",
      "Cyber-ranges are expensive to set up and hard to maintain",
      "Shortage of trained instructors limits practical training",
      "User story: Kevin (3rd-year ICT student, Nairobi) learns theory only - no safe lab to practice",
      "Kevin clicks a WhatsApp \"Safaricom bundles\" link, gets compromised, and is told: \"Be more careful next time.\"",
      "CYBERVERSE closes this gap with a safe environment to test, fail, learn, and improve"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image2.png", alt: "Learners need practical cybersecurity training" },
    stage: {
      cameraPos: [-0.15, 1.45, 4.95],
      cameraTarget: [0.05, 1.05, 0],
      keyLight: 2.8,
      rimLight: 1.9,
      haze: 0.28,
      panelSpread: 0.85
    }
  },
  {
    id: "solution",
    title: "Solution: CYBERVERSE",
    subtitle:
      "A gamified, AI-guided 3D cyber-lab where learners practice real scenarios safely - built for the Kenyan digital ecosystem.",
    bullets: [
      "Interactive Unity environment with missions (phishing, passwords, device hardening, incident response)",
      "NURU AI mentors learners step-by-step with contextual hints and feedback",
      "Multiplayer collaboration for team-based challenges",
      "Localized content for Kenya (mobile money, schools, public services)"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image5.png", alt: "CYBERVERSE cyber-lab missions" },
    stage: {
      cameraPos: [0.35, 1.25, 4.35],
      cameraTarget: [0, 1.02, 0],
      keyLight: 1.8,
      rimLight: 2.6,
      haze: 0.34,
      panelSpread: 0.7
    }
  },
  {
    id: "overview",
    title: "From theory to simulation",
    subtitle: "Cyberverse places users inside realistic scenarios where decisions have consequences.",
    bullets: [
      "Risky actions trigger immediate feedback",
      "AI analyzes behavior during missions",
      "Learning is reinforced through experience - not slides"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image2.png", alt: "Simulation overview" },
    stage: {
      cameraPos: [-0.8, 1.55, 4.4],
      cameraTarget: [0.2, 1.05, 0],
      keyLight: 2.6,
      rimLight: 1.9,
      haze: 0.24,
      panelSpread: 0.9
    }
  },
  {
    id: "nuru",
    title: "NURU AI",
    subtitle: "A behavior-driven, context-aware cybersecurity agent embodied as a 3D character.",
    bullets: [
      "Conversational (text now, voice-ready architecture)",
      "Mission guide and cybersecurity analyst",
      "Detects risky behavior and provides contextual hints",
      "Generates end-of-mission performance breakdowns"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image6.png", alt: "NURU AI" },
    stage: {
      cameraPos: [1.1, 1.35, 4.7],
      cameraTarget: [0, 0.95, 0],
      keyLight: 3.0,
      rimLight: 1.2,
      haze: 0.3,
      panelSpread: 1.15
    }
  },
  {
    id: "missions",
    title: "Cybersecurity training missions",
    subtitle: "Real-world digital safety skills, practiced safely inside the simulation.",
    bullets: [
      "Phishing email detection",
      "Password strength and authentication scenarios",
      "Social engineering awareness",
      "Simulated account compromise events",
      "Decision-making under pressure"
    ],
    mediaPos: "right",
    media: { type: "image", src: "/assets/image5.png", alt: "Training missions" },
    stage: {
      cameraPos: [0, 1.15, 3.7],
      cameraTarget: [0, 1.05, 0],
      keyLight: 1.4,
      rimLight: 2.2,
      haze: 0.38,
      panelSpread: 0.55
    }
  },
  {
    id: "stack",
    title: "Multiplayer + feedback + analytics",
    subtitle: "Built in Unity (C#). Designed to scale from MVP to full platform.",
    bullets: [
      "Networked multiplayer shared environment",
      "Real-time compromise alerts and cues (safe vs risky behavior)",
      "Gamified, behavior-based scoring and rewards",
      "MVP: rule-based behavioral evaluation -> future ML prediction",
      "Roadmap: advanced threats, instructor dashboard, web/mobile"
    ],
    cta: { label: "GitHub Repo", href: "https://github.com/rayfrank/CyberVerseOnline" },
    mediaPos: "right",
    media: { type: "image", src: "/assets/image2.png", alt: "Architecture and roadmap" },
    stage: {
      cameraPos: [0.9, 1.2, 4.0],
      cameraTarget: [0, 1.05, 0],
      keyLight: 2.0,
      rimLight: 2.8,
      haze: 0.26,
      panelSpread: 0.75
    }
  },
  {
    id: "ai",
    layout: "center",
    title: "",
    subtitle: "",
    bullets: [],
    sequence: {
      type: "ai_click",
      todayTitle: "This is what AI chatting looks like today",
      todaySubtitle: "",
      todayImage: "/assets/image7.jpg",
      todayAlt: "Typical chatbot UI",
      bridgeTitle: "Now I'm going to show you what they are going to look like tomorrow...",
      bridgeSubtitle: "This is",
      nuruText: "NURU A.I",
      tomorrowImage: "/assets/image4.png",
      tomorrowAlt: "NURU A.I"
    },
    stage: {
      cameraPos: [0, 1.55, 4.9],
      cameraTarget: [0, 1.05, 0],
      keyLight: 3.3,
      rimLight: 3.1,
      haze: 0.22,
      panelSpread: 1.0
    }
  }
];
