import * as THREE from "three";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
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
    color: 0x0c0c12,
    emissive: 0x0b2430,
    emissiveIntensity: 1.4,
    roughness: 0.45,
    metalness: 0.25
  });
  for (let i = 0; i < 9; i += 1) {
    const w = 0.55 + Math.random() * 0.75;
    const h = 0.35 + Math.random() * 0.55;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), panelMat.clone());
    panel.position.set((Math.random() - 0.5) * 4.2, 0.9 + Math.random() * 2.4, -1.2 - Math.random() * 6.2);
    panel.rotation.y = (Math.random() - 0.5) * 0.55;
    panel.rotation.x = (Math.random() - 0.5) * 0.18;
    panel.userData.base = panel.position.clone();
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
      p.material.emissiveIntensity = 1.15 + Math.sin(t * 0.9 + i * 0.3) * 0.25;
      p.material.opacity = 0.95;
      p.material.transparent = true;
    }

    scene.fog.density = clamp(state.fogDensity, 0.02, 0.16);
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  return { ...state, resize, render };
}

