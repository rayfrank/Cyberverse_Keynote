import { gsap } from "gsap";

const textEl = document.getElementById("text");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const bulletsEl = document.getElementById("bullets");
const mediaWrapEl = document.getElementById("media");
const videoEl = document.getElementById("video");
const imageEl = document.getElementById("image");
const galleryEl = document.getElementById("gallery");
const slideIndexEl = document.getElementById("slideIndex");
const slideTotalEl = document.getElementById("slideTotal");
const ctaEl = document.getElementById("cta");

function resolveMediaSrc(src) {
  const value = src ?? "";
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (/^(data:|blob:)/i.test(value)) return value;
  if (!value.startsWith("/")) return value;
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${value.slice(1)}`;
}

function applyLayout(slide, index1Based) {
  document.body.classList.toggle("layout-center", slide?.layout === "center");
  const side = slide?.mediaPos === "left" ? "left" : "right";
  document.body.classList.toggle("media-left", side === "left");
  document.body.classList.toggle("media-right", side === "right");
  const shiftY = typeof slide?.mediaShiftY === "number" ? slide.mediaShiftY : 0;
  const shiftXRaw = typeof slide?.mediaShiftX === "number" ? slide.mediaShiftX : 0;
  const rotateRaw = typeof slide?.mediaRotateDeg === "number" ? slide.mediaRotateDeg : 0;
  const scale = typeof slide?.mediaScale === "number" ? slide.mediaScale : 1;
  const sign = side === "left" ? -1 : 1;
  const shiftX = shiftXRaw * sign;
  const rotate = rotateRaw * sign;
  document.documentElement.style.setProperty("--media-shift-y", `${shiftY}px`);
  document.documentElement.style.setProperty("--media-shift-x", `${shiftX}px`);
  document.documentElement.style.setProperty("--media-rotate", `${rotate}deg`);
  document.documentElement.style.setProperty("--media-scale", `${scale}`);
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
  galleryEl.replaceChildren();
  galleryEl.style.display = "none";
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
  let i = 0;
  for (const line of lines ?? []) {
    const li = document.createElement("li");
    li.textContent = line;
    li.style.setProperty("--d", `${i * 70}ms`);
    bulletsEl.appendChild(li);
    i += 1;
  }
}

function showImage(src, alt) {
  mediaWrapEl.classList.add("show");
  setImageFallback(imageEl, src);
  imageEl.src = resolveMediaSrc(src);
  imageEl.alt = alt ?? "";
  imageEl.style.display = "block";
  videoEl.style.display = "none";
  galleryEl.style.display = "none";
}

function showVideo(src) {
  mediaWrapEl.classList.add("show");
  videoEl.src = resolveMediaSrc(src);
  videoEl.style.display = "block";
  videoEl.controls = true;
  imageEl.style.display = "none";
  galleryEl.style.display = "none";
}

function setImageFallback(img, src) {
  img.dataset.fallbackStep = "0";
  img.dataset.requestedSrc = src ?? "";
}

function applyImageFallback(img) {
  const requested = img.dataset.requestedSrc ?? "";
  const step = Number(img.dataset.fallbackStep ?? "0");
  if (step > 2) return;

  if (step === 0 && /\/assets\/image8\.png(\?|$)/.test(requested)) {
    img.dataset.fallbackStep = "1";
    img.dataset.requestedSrc = "/assets/image8.jpg";
    img.src = resolveMediaSrc("/assets/image8.jpg");
    return;
  }

  img.dataset.fallbackStep = "2";
  img.dataset.requestedSrc = "/assets/image1.png";
  img.src = resolveMediaSrc("/assets/image1.png");
}

function showGallery(items) {
  mediaWrapEl.classList.add("show");
  galleryEl.replaceChildren();
  galleryEl.style.display = "grid";
  imageEl.style.display = "none";
  videoEl.style.display = "none";

  for (const item of items ?? []) {
    if (!item?.src) continue;
    const figure = document.createElement("figure");
    figure.className = "gallery-card";

    const img = document.createElement("img");
    img.className = "gallery-image";
    setImageFallback(img, item.src);
    img.src = resolveMediaSrc(item.src);
    img.alt = item.alt ?? "";
    img.addEventListener("error", () => applyImageFallback(img), { passive: true });

    const caption = document.createElement("figcaption");
    caption.className = "gallery-caption";
    caption.textContent = item.caption ?? "";

    figure.appendChild(img);
    if (caption.textContent) figure.appendChild(caption);
    galleryEl.appendChild(figure);
  }
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
  initMediaTilt();
  initImageFallback();
}

function initImageFallback() {
  imageEl.addEventListener(
    "error",
    () => applyImageFallback(imageEl),
    { passive: true }
  );
}

function initMediaTilt() {
  let raf = 0;
  let lastX = 0;
  let lastY = 0;

  function apply() {
    raf = 0;
    if (!mediaWrapEl.classList.contains("show")) return;
    const x = Math.max(-1, Math.min(1, lastX));
    const y = Math.max(-1, Math.min(1, lastY));

    const tiltY = (-10 + x * 7).toFixed(2);
    const tiltX = (6 + -y * 5).toFixed(2);
    const tiltZ = (-0.8 + x * 0.35).toFixed(2);

    mediaWrapEl.style.setProperty("--media-tilt-x", `${tiltX}deg`);
    mediaWrapEl.style.setProperty("--media-tilt-y", `${tiltY}deg`);
    mediaWrapEl.style.setProperty("--media-tilt-z", `${tiltZ}deg`);
    mediaWrapEl.style.setProperty("--media-glow-x", `${(55 + x * 14).toFixed(2)}%`);
    mediaWrapEl.style.setProperty("--media-glow-y", `${(35 + y * 10).toFixed(2)}%`);
  }

  function onMove(ev) {
    if (!mediaWrapEl.classList.contains("show")) return;
    const rect = mediaWrapEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    lastX = (ev.clientX - cx) / (rect.width / 2);
    lastY = (ev.clientY - cy) / (rect.height / 2);
    if (raf) return;
    raf = requestAnimationFrame(apply);
  }

  function reset() {
    lastX = 0;
    lastY = 0;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      mediaWrapEl.style.removeProperty("--media-tilt-x");
      mediaWrapEl.style.removeProperty("--media-tilt-y");
      mediaWrapEl.style.removeProperty("--media-tilt-z");
      mediaWrapEl.style.removeProperty("--media-glow-x");
      mediaWrapEl.style.removeProperty("--media-glow-y");
    });
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  mediaWrapEl.addEventListener("pointerleave", reset, { passive: true });
}

export async function renderSlide(slide, index1Based) {
  applyLayout(slide, index1Based);
  setFade(true);
  await new Promise((r) => setTimeout(r, 320));

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
    if (slide.media?.type === "gallery" && slide.media.items?.length) showGallery(slide.media.items);
  }

  await new Promise((r) => setTimeout(r, 10));
  setFade(false);
}

function crossFade(fn, opts = {}) {
  const durationOut = typeof opts.out === "number" ? opts.out : 0.38;
  const durationIn = typeof opts.in === "number" ? opts.in : 0.44;
  const tl = gsap.timeline();
  tl.to(
    [textEl, mediaWrapEl],
    {
      opacity: 0,
      duration: durationOut,
      ease: "power2.inOut",
      "--enter-y": "26px",
      "--enter-scale": 0.985,
      "--enter-blur": "8px"
    },
    0
  );
  tl.call(fn);
  tl.to(
    [textEl, mediaWrapEl],
    {
      opacity: 1,
      duration: durationIn,
      ease: "power2.out",
      "--enter-y": "0px",
      "--enter-scale": 1,
      "--enter-blur": "0px"
    },
    0.02
  );
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
  const demoTitle = cfg.demoTitle ?? "Demo";

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
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.18, ease: "power3.out" }
      );
    }

  if (stepIndex === 3) {
    setTitlePlain(nuruText);
    setSubtitle("");
    if (tomorrowImage) showImage(tomorrowImage, tomorrowAlt);
    return null;
  }

  if (stepIndex === 4) {
    setTitlePlain(demoTitle);
    setSubtitle("");
    return null;
  }

  return null;
}

export function createSlideController(slide) {
  if (!slide?.sequence) return null;

  if (slide.sequence.type !== "ai_click") return null;

  const cfg = slide.sequence;
  const lastStep = 4;
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
