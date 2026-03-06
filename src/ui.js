import { gsap } from "gsap";

const textEl = document.getElementById("text");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const bulletsEl = document.getElementById("bullets");
const mediaWrapEl = document.getElementById("media");
const videoEl = document.getElementById("video");
const imageEl = document.getElementById("image");
const slideIndexEl = document.getElementById("slideIndex");
const slideTotalEl = document.getElementById("slideTotal");
const ctaEl = document.getElementById("cta");

function applyLayout(slide) {
  document.body.classList.toggle("layout-center", slide?.layout === "center");
}

function setFade(out) {
  const cls = out ? "fade-out" : "fade-in";
  const remove = out ? "fade-in" : "fade-out";
  textEl.classList.remove(remove);
  mediaWrapEl.classList.remove(remove);
  textEl.classList.add(cls);
  mediaWrapEl.classList.add(cls);
}

function stopMedia() {
  try {
    videoEl.pause();
  } catch {
    // ignore
  }
  videoEl.removeAttribute("src");
  videoEl.load();
  videoEl.style.display = "none";
  imageEl.removeAttribute("src");
  imageEl.style.display = "none";
  mediaWrapEl.classList.remove("show");
}

function setTitlePlain(text) {
  titleEl.textContent = text ?? "";
}

function setSubtitle(text) {
  subtitleEl.textContent = text ?? "";
}

function setBullets(lines) {
  bulletsEl.innerHTML = "";
  for (const line of lines ?? []) {
    const li = document.createElement("li");
    li.textContent = line;
    bulletsEl.appendChild(li);
  }
}

function showImage(src, alt) {
  mediaWrapEl.classList.add("show");
  imageEl.src = src;
  imageEl.alt = alt ?? "";
  imageEl.style.display = "block";
  videoEl.style.display = "none";
}

function showVideo(src) {
  mediaWrapEl.classList.add("show");
  videoEl.src = src;
  videoEl.style.display = "block";
  videoEl.controls = true;
  imageEl.style.display = "none";
}

function setTitleChars(text) {
  const value = text ?? "";
  titleEl.innerHTML = "";
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00A0" : ch;
    titleEl.appendChild(span);
  }
}

export function initUI(totalSlides) {
  slideTotalEl.textContent = `/${totalSlides}`;
}

export async function renderSlide(slide, index1Based) {
  applyLayout(slide);
  setFade(true);
  await new Promise((r) => setTimeout(r, 170));

  // For sequence slides, we render an initial static state; progression happens only on user input.
  if (slide?.sequence?.type) {
    setTitlePlain(slide.title ?? "");
    setSubtitle(slide.subtitle ?? "");
    setBullets([]);
  } else {
    setTitlePlain(slide.title);
    setSubtitle(slide.subtitle);
    setBullets(slide.bullets);
  }

  slideIndexEl.textContent = String(index1Based);

  if (slide.cta?.href) {
    ctaEl.href = slide.cta.href;
    ctaEl.textContent = slide.cta.label ?? "Open link";
    ctaEl.style.visibility = "visible";
  } else {
    ctaEl.href = "#";
    ctaEl.textContent = "";
    ctaEl.style.visibility = "hidden";
  }

  stopMedia();
  if (!slide?.sequence?.type) {
    if (slide.media?.type === "video" && slide.media.src) showVideo(slide.media.src);
    if (slide.media?.type === "image" && slide.media.src) showImage(slide.media.src, slide.media.alt);
  }

  await new Promise((r) => setTimeout(r, 10));
  setFade(false);
}

function crossFade(fn, opts = {}) {
  const durationOut = typeof opts.out === "number" ? opts.out : 0.22;
  const durationIn = typeof opts.in === "number" ? opts.in : 0.26;
  const tl = gsap.timeline();
  tl.to([textEl, mediaWrapEl], { opacity: 0, y: 10, duration: durationOut, ease: "power2.inOut" }, 0);
  tl.call(fn);
  tl.to([textEl, mediaWrapEl], { opacity: 1, y: 0, duration: durationIn, ease: "power2.out" }, 0.02);
  return tl;
}

function renderAiClickStep(cfg, stepIndex, animate) {
  const todayTitle = cfg.todayTitle ?? "This is what AI chatting looks like today";
  const todaySubtitle = cfg.todaySubtitle ?? "";
  const todayImage = cfg.todayImage;
  const todayAlt = cfg.todayAlt ?? "Typical chatbot UI";

  const bridgeTitle = cfg.bridgeTitle ?? "Now I’m going to show you what they’re going to look like tomorrow…";
  const bridgeSubtitle = cfg.bridgeSubtitle ?? "This is";
  const nuruText = cfg.nuruText ?? "NURU A.I";
  const tomorrowImage = cfg.tomorrowImage;
  const tomorrowAlt = cfg.tomorrowAlt ?? "NURU A.I";

  stopMedia();
  setBullets([]);

  if (stepIndex === 0) {
    setTitlePlain(todayTitle);
    setSubtitle(todaySubtitle);
    if (todayImage) showImage(todayImage, todayAlt);
    return null;
  }

  if (stepIndex === 1) {
    setTitlePlain(bridgeTitle);
    setSubtitle(bridgeSubtitle);
    return null;
  }

  if (stepIndex === 2) {
    setSubtitle("");
    setTitleChars(nuruText);
    if (!animate) return null;
    const chars = titleEl.querySelectorAll(".char");
    return gsap.fromTo(
      chars,
      { opacity: 0, y: 28, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, stagger: 0.12, ease: "power3.out" }
    );
  }

  if (stepIndex === 3) {
    setTitlePlain(nuruText);
    setSubtitle("");
    if (tomorrowImage) showImage(tomorrowImage, tomorrowAlt);
    return null;
  }

  return null;
}

export function createSlideController(slide) {
  if (!slide?.sequence) return null;

  if (slide.sequence.type !== "ai_click") return null;

  const cfg = slide.sequence;
  const lastStep = 3;
  let stepIndex = 0;
  let busy = null;

  // Initial state: no automatic progression.
  crossFade(() => renderAiClickStep(cfg, 0, false)).progress(1);

  return {
    next() {
      if (busy) {
        busy.progress(1);
        busy = null;
        return true;
      }
      if (stepIndex >= lastStep) return false;
      stepIndex += 1;

      const tl = crossFade(() => {
        const maybeTween = renderAiClickStep(cfg, stepIndex, true);
        if (maybeTween) busy = maybeTween;
      });
      busy = tl;
      tl.eventCallback("onComplete", () => {
        if (busy === tl) busy = null;
      });
      return true;
    },
    prev() {
      if (busy) {
        busy.kill();
        busy = null;
      }
      if (stepIndex <= 0) return false;
      stepIndex -= 1;
      const tl = crossFade(() => renderAiClickStep(cfg, stepIndex, false));
      busy = tl;
      tl.eventCallback("onComplete", () => {
        if (busy === tl) busy = null;
      });
      return true;
    },
    dispose() {
      if (busy) busy.kill();
      busy = null;
    }
  };
}
