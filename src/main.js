import "./style.css";
import { SLIDES } from "./deck.js";
import { initUI, renderSlide, createSlideController } from "./ui.js";
import { createStage } from "./stage.js";
import { applyStageSlide } from "./transitions.js";

const canvas = document.getElementById("stage");
const stage = createStage(canvas);

let currentIndex = 0;
let isAnimating = false;
let slideController = null;

initUI(SLIDES.length);

function clampIndex(i) {
  return Math.max(0, Math.min(SLIDES.length - 1, i));
}

async function goTo(index) {
  const nextIndex = clampIndex(index);
  if (nextIndex === currentIndex || isAnimating) return;
  isAnimating = true;

  if (slideController) slideController.dispose();
  slideController = null;

  const slide = SLIDES[nextIndex];
  applyStageSlide(stage, slide.stage).eventCallback("onComplete", () => {
    isAnimating = false;
  });
  await renderSlide(slide, nextIndex + 1);
  slideController = createSlideController(slide);
  currentIndex = nextIndex;
}

async function start() {
  await renderSlide(SLIDES[0], 1);
  applyStageSlide(stage, SLIDES[0].stage);
  slideController = createSlideController(SLIDES[0]);
}

function next() {
  if (slideController?.next?.()) return;
  void goTo(currentIndex + 1);
}

function prev() {
  if (slideController?.prev?.()) return;
  void goTo(currentIndex - 1);
}

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.code === "ArrowRight" || e.code === "Space" || e.code === "PageDown") {
    e.preventDefault();
    next();
  }
  if (e.code === "ArrowLeft" || e.code === "PageUp") {
    e.preventDefault();
    prev();
  }
  if (e.code === "Home") {
    e.preventDefault();
    void goTo(0);
  }
  if (e.code === "End") {
    e.preventDefault();
    void goTo(SLIDES.length - 1);
  }
});

window.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  next();
});

window.addEventListener("resize", () => stage.resize());
stage.resize();

let raf = 0;
function loop(t) {
  stage.render(t);
  raf = window.requestAnimationFrame(loop);
}
raf = window.requestAnimationFrame(loop);

void start();
