import * as THREE from "three";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function drawRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function createQuoteTexture(renderer, quote, author = "Steve Jobs") {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "rgba(8, 12, 18, 0.92)");
  bg.addColorStop(1, "rgba(10, 10, 18, 0.92)");
  ctx.fillStyle = bg;
  drawRoundRect(ctx, 22, 22, w - 44, h - 44, 36);
  ctx.fill();

  // Border + glow
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(102, 227, 255, 0.34)";
  ctx.shadowColor = "rgba(102, 227, 255, 0.28)";
  ctx.shadowBlur = 28;
  drawRoundRect(ctx, 22, 22, w - 44, h - 44, 36);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Accent line
  const accent = ctx.createLinearGradient(0, 0, w, 0);
  accent.addColorStop(0, "rgba(102, 227, 255, 0.0)");
  accent.addColorStop(0.2, "rgba(102, 227, 255, 0.35)");
  accent.addColorStop(0.8, "rgba(179, 156, 255, 0.35)");
  accent.addColorStop(1, "rgba(179, 156, 255, 0.0)");
  ctx.fillStyle = accent;
  drawRoundRect(ctx, 58, 74, w - 116, 8, 6);
  ctx.fill();

  // Text
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "600 44px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const marginX = 74;
  const marginY = 110;
  const maxWidth = w - marginX * 2;
  const words = String(quote ?? "").trim().split(/\s+/).filter(Boolean);

  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  const maxLines = 4;
  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    clipped[maxLines - 1] = `${clipped[maxLines - 1]}…`;
  }

  for (let i = 0; i < clipped.length; i += 1) {
    ctx.fillText(clipped[i], marginX, marginY + i * 58);
  }

  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.font = "500 26px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(`- ${author}`, marginX, h - 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy?.() ?? 1;
  texture.needsUpdate = true;
  return texture;
}

export function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(0x07070a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07070a, 0.06);

  const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 100);
  camera.position.set(0, 1.4, 5);

  const target = new THREE.Vector3(0, 1.0, 0);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x05050a,
      roughness: 0.9,
      metalness: 0.05
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  const grid = new THREE.GridHelper(30, 70, 0x1db7c7, 0x3b3b48);
  grid.material.opacity = 0.18;
  grid.material.transparent = true;
  grid.position.y = 0.01;
  scene.add(grid);

  const hemi = new THREE.HemisphereLight(0x94c7ff, 0x020207, 0.55);
  scene.add(hemi);

  const keyLight = new THREE.SpotLight(0x66e3ff, 2.2, 40, Math.PI / 7, 0.35, 1);
  keyLight.position.set(2.6, 6.5, 6.5);
  keyLight.target.position.set(0, 1.0, 0);
  scene.add(keyLight);
  scene.add(keyLight.target);

  const rimLight = new THREE.PointLight(0xb39cff, 1.2, 35, 2);
  rimLight.position.set(-3.2, 3.0, -3.2);
  scene.add(rimLight);

  const panels = [];
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x10131b,
    emissive: 0x0f2f3c,
    emissiveIntensity: 1.7,
    roughness: 0.5,
    metalness: 0.18
  });
  const jobsQuotes = [
    "Innovation distinguishes between a leader and a follower.",
    "Stay hungry, stay foolish.",
    "The people who are crazy enough to think they can change the world are the ones who do.",
    "Design is not just what it looks like and feels like. Design is how it works.",
    "Sometimes life is going to hit you in the head with a brick. Don’t lose faith."
  ];
  for (let i = 0; i < 9; i += 1) {
    const w = 0.9 + Math.random() * 1.05;
    const h = 0.58 + Math.random() * 0.78;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), panelMat.clone());
    panel.position.set((Math.random() - 0.5) * 4.0, 1.0 + Math.random() * 2.2, -0.9 - Math.random() * 5.4);
    panel.rotation.y = (Math.random() - 0.5) * 0.55;
    panel.rotation.x = (Math.random() - 0.5) * 0.18;
    panel.userData.base = panel.position.clone();

    const quote = jobsQuotes[Math.floor(Math.random() * jobsQuotes.length)];
    const tex = createQuoteTexture(renderer, quote);
    if (tex) {
      panel.userData.hasQuote = true;
      panel.material.map = tex;
      panel.material.emissiveMap = tex;
      panel.material.emissiveIntensity = 0.95;
      panel.material.roughness = 0.55;
      panel.material.metalness = 0.08;
      panel.material.transparent = true;
      panel.material.opacity = 0.995;
      panel.material.needsUpdate = true;
    }

    panels.push(panel);
    scene.add(panel);
  }

  const particlesCount = 1600;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i += 1) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 18;
    positions[i3 + 1] = 0.5 + Math.random() * 6.2;
    positions[i3 + 2] = (Math.random() - 0.5) * 18;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x66e3ff,
    size: 0.016,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  const state = {
    renderer,
    scene,
    camera,
    target,
    fogDensity: 0.06,
    keyLight,
    rimLight,
    hemi,
    grid,
    floor,
    particles,
    panels,
    panelSpread: 1
  };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function render(timeMs) {
    const t = timeMs * 0.001;

    // Subtle "stage alive" motion
    particles.rotation.y = t * 0.04;
    grid.material.opacity = 0.14 + Math.sin(t * 0.65) * 0.03;

    const spread = state.panelSpread;
    for (let i = 0; i < panels.length; i += 1) {
      const p = panels[i];
      const base = p.userData.base;
      p.position.x = base.x * spread + Math.sin(t * 0.8 + i) * 0.06;
      p.position.y = base.y + Math.cos(t * 0.9 + i) * 0.05;
      p.rotation.y += Math.sin(t * 0.2 + i) * 0.0009;

      const emissive = p.material.emissive;
      emissive.setHex(i % 2 === 0 ? 0x0b2430 : 0x130b30);
      const baseIntensity = p.userData.hasQuote ? 0.72 : 1.15;
      const wiggle = p.userData.hasQuote ? 0.16 : 0.25;
      p.material.emissiveIntensity = baseIntensity + Math.sin(t * 0.9 + i * 0.3) * wiggle;
      p.material.opacity = p.userData.hasQuote ? 0.995 : 0.98;
      p.material.transparent = true;
    }

    scene.fog.density = clamp(state.fogDensity, 0.02, 0.16);
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  return { ...state, resize, render };
}
