import { gsap } from "gsap";

export function applyStageSlide(stage, slideStage) {
  const s = slideStage ?? {};
  const cameraPos = s.cameraPos ?? [0, 1.4, 5];
  const cameraTarget = s.cameraTarget ?? [0, 1.0, 0];
  const keyLight = typeof s.keyLight === "number" ? s.keyLight : 2.2;
  const rimLight = typeof s.rimLight === "number" ? s.rimLight : 1.2;
  const haze = typeof s.haze === "number" ? s.haze : 0.2;
  const panelSpread = typeof s.panelSpread === "number" ? s.panelSpread : 1;

  const tl = gsap.timeline({ defaults: { duration: 1.05, ease: "power2.out" } });
  tl.to(stage.camera.position, { x: cameraPos[0], y: cameraPos[1], z: cameraPos[2] }, 0);
  tl.to(stage.target, { x: cameraTarget[0], y: cameraTarget[1], z: cameraTarget[2] }, 0);
  tl.to(stage.keyLight, { intensity: keyLight }, 0);
  tl.to(stage.rimLight, { intensity: rimLight }, 0);
  tl.to(stage, { fogDensity: 0.04 + haze * 0.22 }, 0);
  tl.to(stage, { panelSpread }, 0);
  return tl;
}

