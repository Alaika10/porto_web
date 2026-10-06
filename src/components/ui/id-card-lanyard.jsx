import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CSS = `
.idcl-root{
  --idcl-ink-faint:#5b6270;
  --idcl-accent:#5b8cff;
  --idcl-accent-dim:#2f4488;
  --idcl-card:#faf7f1;
  --idcl-card-2:#efeadf;
  --idcl-card-ink:#15171d;
  --idcl-card-soft:#666c78;
  --idcl-card-line:#e1dbcb;
  --idcl-font-display:'Archivo','Arial Narrow',sans-serif;
  --idcl-font-mono:'JetBrains Mono','Consolas',monospace;
  --idcl-font-script:'Caveat',cursive;
  font-family:'Work Sans',system-ui,sans-serif;
}
.idcl-root *{ box-sizing:border-box; }

/* Container mode: fills the parent, no fixed positioning */
.idcl-root{
  position:relative;
  width:100%;
  height:100%;
  pointer-events:none;
}
.idcl-stage{
  position:absolute;
  inset:0;
  z-index:var(--idcl-z, 10);
  pointer-events:none;
  overflow:visible;
  animation: idcl-fadein 0.7s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes idcl-fadein{
  from{ opacity:0; transform:translateY(-20px); }
  to{ opacity:1; transform:translateY(0); }
}
.idcl-rope{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  pointer-events:none;
  display:block;
}
.idcl-rail{
  position:absolute;
  top:-4px;
  width:72px; height:8px;
  transform:translateX(-50%);
  background:linear-gradient(180deg, #2a2f3a 0%, #3d4455 50%, #21252f 100%);
  border-radius:0 0 6px 6px;
  box-shadow:0 3px 10px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.12);
  pointer-events:none;
}
.idcl-rail::before{
  content:'';
  position:absolute;
  top:0; left:50%;
  transform:translateX(-50%);
  width:28px; height:4px;
  background:linear-gradient(90deg, #555a66, #8a8f9a, #555a66);
  border-radius:0 0 3px 3px;
}
.idcl-card{
  position:absolute;
  width:clamp(196px, 60vw, 236px);
  aspect-ratio: 236 / 460;
  perspective:1400px;
  cursor:grab; touch-action:none; user-select:none;
  pointer-events:auto;
}
.idcl-card:active{ cursor:grabbing; }
.idcl-flipper{ position:relative; width:100%; height:100%; transform-style:preserve-3d; }
.idcl-face{
  position:absolute; inset:0; border-radius:18px;
  padding:16px 16px 14px;
  display:flex; flex-direction:column;
  backface-visibility:hidden;
  box-shadow:
    0 32px 60px -16px rgba(0,0,0,.6),
    0 10px 20px -8px rgba(0,0,0,.4),
    inset 0 1px 0 rgba(255,255,255,.65),
    inset 0 0 0 1px rgba(0,0,0,.05);
}
.idcl-face::before{
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:
    linear-gradient(180deg, rgba(255,255,255,.55) 0%, transparent 24%),
    radial-gradient(rgba(0,0,0,.07) 1px, transparent 1.3px) 0 0/3px 3px;
  mix-blend-mode:multiply; opacity:.6;
}
.idcl-face::after{
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.6), transparent 40%);
  mix-blend-mode:overlay; opacity:0; transition:opacity .3s ease;
}
.idcl-card.idcl-hovering .idcl-face::after{ opacity:1; }
@media (prefers-reduced-motion: reduce){ .idcl-face::after{ transition:none; } }
.idcl-front{ background:linear-gradient(165deg, var(--idcl-card), var(--idcl-card-2)); align-items:stretch; text-align:left; }
.idcl-back{ background:linear-gradient(165deg, var(--idcl-card-2), var(--idcl-card)); transform:rotateY(180deg); }
.idcl-holo{
  position:absolute; top:14px; bottom:14px; right:5px; width:6px; border-radius:5px;
  background:repeating-linear-gradient(125deg, #eef1f7 0%, #cfd6e4 10%, #b9c2d6 20%, #e7ebf3 30%, #eef1f7 40%);
  background-size:220% 220%;
  animation:idcl-foil 7s linear infinite;
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.1), 0 0 6px rgba(255,255,255,.3);
}
@keyframes idcl-foil{ to{ background-position:220% 0%; } }
@media (prefers-reduced-motion: reduce){ .idcl-holo{ animation:none; } }
.idcl-hole{ width:32px; height:9px; background:var(--idcl-card-ink); border-radius:5px; margin:0 auto 10px; flex-shrink:0; opacity:.85; }
.idcl-header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
.idcl-brand{ display:flex; align-items:flex-start; gap:6px; }
.idcl-brand-mark{ font-size:12px; color:var(--idcl-accent); line-height:1; margin-top:1px; }
.idcl-brand-text{ display:flex; flex-direction:column; }
.idcl-brand-text b{ font-family:var(--idcl-font-display); font-weight:800; font-size:11.5px; letter-spacing:.01em; color:var(--idcl-card-ink); line-height:1.2; }
.idcl-brand-text small{ font-family:var(--idcl-font-mono); font-size:6.3px; letter-spacing:.09em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-pillars{ display:flex; flex-direction:column; align-items:flex-end; gap:1px; }
.idcl-pillars span{ font-family:var(--idcl-font-mono); font-size:7px; letter-spacing:.1em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-pillars i{ width:16px; height:2px; background:var(--idcl-card-ink); margin-top:3px; }
.idcl-photo{
  position:relative; width:100%; height:112px; border-radius:10px;
  background:#eae7de; overflow:hidden; margin-bottom:12px; flex-shrink:0;
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.08), inset 0 2px 6px rgba(0,0,0,.12);
}
.idcl-photo img{ width:100%; height:100%; object-fit:cover; object-position:center top; display:block; }
.idcl-photo svg{ width:100%; height:100%; display:block; }
.idcl-verified{
  position:absolute; right:-6px; bottom:-6px; width:22px; height:22px; border-radius:50%;
  background:linear-gradient(160deg, var(--idcl-accent), var(--idcl-accent-dim));
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 6px rgba(0,0,0,.4), 0 0 0 3px var(--idcl-card);
}
.idcl-verified svg{ width:11px; height:11px; }
.idcl-name{ margin:0 0 2px; font-family:var(--idcl-font-display); font-weight:800; font-size:18px; color:var(--idcl-card-ink); letter-spacing:-.01em; }
.idcl-role{ margin:0 0 10px; font-size:10px; color:var(--idcl-card-soft); font-weight:600; letter-spacing:.09em; text-transform:uppercase; }
.idcl-divider{ width:100%; height:1px; background:var(--idcl-card-line); margin-bottom:10px; }
.idcl-idrow{ width:100%; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:16px; }
.idcl-idrow-labels{ display:flex; flex-direction:column; gap:5px; font-family:var(--idcl-font-mono); }
.idcl-idrow-labels div{ display:flex; gap:8px; align-items:baseline; }
.idcl-idrow-labels span{ width:56px; flex-shrink:0; font-size:7.6px; letter-spacing:.06em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-idrow-labels b{ font-size:9.5px; font-weight:600; color:var(--idcl-card-ink); }
.idcl-footer{
  width:100%; margin-top:auto; padding-top:10px; border-top:1px solid var(--idcl-card-line);
  text-align:center; font-family:var(--idcl-font-mono); font-size:8.5px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--idcl-card-soft);
}
.idcl-footer i{ color:var(--idcl-card-line); font-style:normal; margin:0 5px; }
.idcl-stripe{ width:100%; height:30px; background:repeating-linear-gradient(45deg, #1b1d24, #1b1d24 6px, #26282f 6px, #26282f 12px); border-radius:3px; margin-bottom:12px; }
.idcl-barcode{ display:flex; align-items:flex-end; gap:2px; height:32px; width:100%; background:#fff; border-radius:3px; padding:0 4px; margin-bottom:8px; overflow:hidden; }
.idcl-barcode span{ width:2px; background:#1a1c22; }
.idcl-idnum{ margin:0 0 8px; font-family:var(--idcl-font-mono); font-size:10px; font-weight:600; color:var(--idcl-card-ink); letter-spacing:.03em; display:flex; justify-content:space-between; font-variant-numeric:tabular-nums; }
.idcl-idnum em{ font-style:normal; color:var(--idcl-card-soft); }
.idcl-backrow{ display:flex; gap:12px; align-items:flex-start; margin-bottom:10px; }
.idcl-qr{ display:grid; grid-template-columns:repeat(9,1fr); gap:1px; width:58px; height:58px; background:#fff; padding:4px; border-radius:4px; flex-shrink:0; box-shadow:0 0 0 1px var(--idcl-card-line); }
.idcl-qr i{ background:transparent; }
.idcl-qr i.on{ background:#181a20; }
.idcl-qr.idcl-small{ width:46px; height:46px; padding:3px; }
.idcl-scan{ font-family:var(--idcl-font-mono); font-size:8.4px; color:var(--idcl-card-soft); line-height:1.5; padding-top:2px; text-align:left; }
.idcl-scan b{ color:var(--idcl-card-ink); display:block; font-size:9px; margin-bottom:2px; letter-spacing:.03em; }
.idcl-connect{ display:flex; align-items:center; justify-content:space-between; margin-top:14px; }
.idcl-connect span{ font-family:var(--idcl-font-mono); font-size:8px; letter-spacing:.1em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-connect-icons{ display:flex; gap:6px; }
.idcl-connect-icons a{
  width:24px; height:24px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  border:1px solid var(--idcl-card-line); color:var(--idcl-card-soft);
  transition:border-color .15s ease, color .15s ease, transform .15s ease;
}
.idcl-connect-icons a:hover{ border-color:var(--idcl-accent); color:var(--idcl-accent); transform:translateY(-1px); }
.idcl-connect-icons svg{ width:12px; height:12px; }
.idcl-sig{ margin-top:auto; }
.idcl-sig .idcl-script{ font-family:var(--idcl-font-script); font-size:26px; color:var(--idcl-card-ink); line-height:1; }
.idcl-sig small{ display:block; font-family:var(--idcl-font-mono); font-size:8px; letter-spacing:.08em; text-transform:uppercase; color:var(--idcl-card-soft); border-top:1px solid var(--idcl-card-line); margin-top:4px; padding-top:4px; }
.idcl-hint{
  position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
  display:flex; align-items:center; gap:7px;
  background:rgba(8,10,14,.78);
  color:rgba(243,240,233,.9);
  padding:8px 16px;
  border-radius:999px;
  font-family:var(--idcl-font-mono);
  font-size:10.5px; letter-spacing:.04em;
  pointer-events:none;
  opacity:1;
  transition:opacity .5s ease;
  white-space:nowrap;
  z-index:20;
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 4px 20px rgba(0,0,0,.35);
  backdrop-filter:blur(8px);
}
.idcl-hint.idcl-hint-hidden{ opacity:0; pointer-events:none; }
.idcl-hint svg{ width:12px; height:12px; opacity:.65; flex-shrink:0; }
`;

export function IDCardLanyard({
  name = "Alaika",
  role = "Data Scientist & AI",
  brand = "ALAIKA",
  brandTagline = "Data Science Studio",
  pillars = ["Data", "Model", "Insight"],
  location = "Tegal, ID",
  idNumber = "AL-2024",
  validThru = "12/2029",
  site = "alaika.dev/work",
  githubUrl,
  linkedinUrl,
  instagramUrl,
  zIndex = 10,
  showHint = true,
  className = "",
  photoUrl,
}) {
  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const railRef = useRef(null);
  const cardRef = useRef(null);
  const flipperRef = useRef(null);
  const barcodeRef = useRef(null);
  const qrBackRef = useRef(null);
  const qrFrontRef = useRef(null);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const id = "idcl-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const rail = railRef.current;
    const card = cardRef.current;
    const flipper = flipperRef.current;
    const barcodeEl = barcodeRef.current;
    const qrBackEl = qrBackRef.current;
    const qrFrontEl = qrFrontRef.current;
    if (!root || !scene || !canvas || !rail || !card || !flipper || !barcodeEl || !qrBackEl || !qrFrontEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Barcode bars
    barcodeEl.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement("span");
      bar.style.height = ((i * 37) % 100 > 40 ? 100 : 55) + "%";
      barcodeEl.appendChild(bar);
    }

    function buildQR(el, seed) {
      el.innerHTML = "";
      const N = 9;
      const seedOn = new Set([
        0, 1, 2, 9, 10, 11, 18, 19, 20,
        6, 7, 8, 15, 16, 17, 24, 25, 26,
        54, 55, 56, 63, 64, 65, 72, 73, 74,
      ]);
      for (let i = 0; i < N * N; i++) {
        const cell = document.createElement("i");
        const pseudoRandom = (i * seed) % 97 < 46;
        if (seedOn.has(i) || pseudoRandom) cell.classList.add("on");
        el.appendChild(cell);
      }
    }
    buildQR(qrBackEl, 928371);
    buildQR(qrFrontEl, 574123);

    // Helper: get container rect and compute anchor in container-local coords
    function getContainerSize() {
      const rect = root.getBoundingClientRect();
      return { w: rect.width, h: rect.height, left: rect.left, top: rect.top };
    }

    // Anchor: center-top of container
    function getAnchor() {
      const { w } = getContainerSize();
      return { x: w / 2, y: 0 };
    }

    function resize() {
      const { w, h } = getContainerSize();
      // Only resize if dimensions actually changed (avoids clearing canvas unnecessarily)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      anchor = getAnchor();
      rail.style.left = anchor.x + "px";
      rail.style.top = "0px";
    }

    const NUM_POINTS = 16;
    const REST_LENGTH = 220;
    const SEGMENT_LENGTH = REST_LENGTH / (NUM_POINTS - 1);
    const GRAVITY = 0.42;
    const FRICTION = 0.985;
    const CONSTRAINT_ITERATIONS = 8;
    const TAP_THRESHOLD = 6;
    const MAX_TILT = 12;

    let anchor = getAnchor();

    const points = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      // Spread points straight down. Give a tiny x-offset alternating so
      // last two points never start at exactly the same coords (avoids atan2(0,0)).
      const initX = anchor.x + (i > 0 ? (i % 2 === 0 ? 0.5 : -0.5) : 0);
      const initY = (i / (NUM_POINTS - 1)) * REST_LENGTH;
      points.push({
        x: initX,
        y: initY,
        oldx: initX,
        oldy: initY - 0.5,
        pinned: i === 0
      });
    }

    let dragging = false;
    let flipped = false;

    // Delay initial canvas sizing until container has real layout dimensions
    requestAnimationFrame(() => requestAnimationFrame(() => {
      resize();
      // Re-center points to real container width
      const a = getAnchor();
      for (let i = 0; i < points.length; i++) {
        const ratio = i / (NUM_POINTS - 1);
        points[i].x = a.x + (i > 0 ? (i % 2 === 0 ? 0.5 : -0.5) : 0);
        points[i].oldx = points[i].x;
        points[i].y = ratio * REST_LENGTH;
        points[i].oldy = ratio * REST_LENGTH - 0.5;
      }
    }));
    let downPos = { x: anchor.x, y: anchor.y };
    let pointer = { x: anchor.x, y: anchor.y + REST_LENGTH };
    let lastPointer = { ...pointer };
    let velocity = { x: 0, y: 0 };
    let flipTarget = 0;
    let flipCurrent = 0;
    const tiltTarget = { x: 0, y: 0 };
    const tiltCurrent = { x: 0, y: 0 };
    // Mouse in container-local coords
    let mouse = { x: -9999, y: -9999 };

    // Convert window clientX/Y → container-local coords
    function toLocal(clientX, clientY) {
      const rect = root.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function clampToContainer(p) {
      const { w, h } = getContainerSize();
      const margin = 12;
      p.x = Math.max(margin, Math.min(w - margin, p.x));
      p.y = Math.max(0, Math.min(h - 20, p.y));
      return p;
    }

    function updatePoints() {
      anchor = getAnchor();
      for (let i = 1; i < points.length; i++) {
        if (dragging && i === points.length - 1) continue;
        const p = points[i];
        const vx = (p.x - p.oldx) * FRICTION;
        const vy = (p.y - p.oldy) * FRICTION;
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }
    }

    function applyConstraints() {
      points[0].x = anchor.x;
      points[0].y = anchor.y;
      if (dragging) {
        const last = points[points.length - 1];
        last.x = pointer.x;
        last.y = pointer.y;
      }
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const diff = (SEGMENT_LENGTH - dist) / dist;
          const offX = dx * diff * 0.5;
          const offY = dy * diff * 0.5;
          const p1Locked = p1.pinned;
          const p2Locked = dragging && i + 1 === points.length - 1;
          if (!p1Locked) { p1.x -= offX; p1.y -= offY; }
          if (!p2Locked) { p2.x += offX; p2.y += offY; }
        }
      }
      for (let i = 1; i < points.length; i++) clampToContainer(points[i]);
    }

    function drawRope() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Build smooth bezier path through all points
      const path = [];
      path.push({ x: points[0].x, y: points[0].y });
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        path.push({ x: points[i].x, y: points[i].y, cx: midX, cy: midY });
      }
      path.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });

      function drawPath() {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          const p = path[i];
          if (p.cx !== undefined) ctx.quadraticCurveTo(p.x, p.y, p.cx, p.cy);
          else ctx.lineTo(p.x, p.y);
        }
      }

      // 1. Drop shadow
      ctx.save();
      ctx.translate(3, 6);
      ctx.globalAlpha = 0.22;
      drawPath();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();

      // 2. Main lanyard body — dark charcoal
      drawPath();
      ctx.strokeStyle = "#1a1d24";
      ctx.lineWidth = 17;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // 3. Subtle dark edge
      drawPath();
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 17.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // 4. Core fill
      drawPath();
      ctx.strokeStyle = "#22252e";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // 5. Center highlight stripe
      drawPath();
      ctx.strokeStyle = "rgba(255,255,255,0.09)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // 6. Weave pattern mark (safety chevron)
      const markIdx = Math.floor(points.length * 0.38);
      if (markIdx > 0 && markIdx < points.length - 1) {
        const m = points[markIdx];
        const mPrev = points[markIdx - 1];
        const mNext = points[markIdx + 1];
        const angle = Math.atan2(mNext.y - mPrev.y, mNext.x - mPrev.x) + Math.PI / 2;
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(angle);
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(-5, 4);
        ctx.lineTo(0, -4);
        ctx.lineTo(5, 4);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawClip() {
      ctx.save();
      ctx.translate(anchor.x, anchor.y + 2);

      // Clip body gradient — metallic silver
      const g = ctx.createLinearGradient(-13, -10, 13, 10);
      g.addColorStop(0,   "#f0f2f5");
      g.addColorStop(0.2, "#c8cbd2");
      g.addColorStop(0.5, "#8e929b");
      g.addColorStop(0.8, "#6a6e77");
      g.addColorStop(1,   "#3d4048");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(-13, -10, 26, 18, 5);
      ctx.fill();

      // Outer stroke
      ctx.strokeStyle = "rgba(0,0,0,.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top shine line
      ctx.strokeStyle = "rgba(255,255,255,.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-9, -7);
      ctx.lineTo(9, -7);
      ctx.stroke();

      // Center pin hole
      const pinGrad = ctx.createRadialGradient(0, 0, 0.5, 0, 0, 3);
      pinGrad.addColorStop(0, "#1a1c22");
      pinGrad.addColorStop(1, "#3a3d46");
      ctx.fillStyle = pinGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function positionCard() {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const dx = last.x - prev.x;
      const dy = last.y - prev.y;
      const dist = Math.hypot(dx, dy);
      // If segment is too short (collapsed), default to straight down (angle=0)
      const angle = dist > 0.5 ? (Math.atan2(dy, dx) - Math.PI / 2) : 0;
      // Place card so its top-center sits at the rope's last point.
      card.style.left = (last.x - card.offsetWidth / 2) + "px";
      card.style.top = last.y + "px";
      card.style.transformOrigin = "top center";
      card.style.transform = `rotate(${angle}rad)`;
    }

    function updateTiltAndSheen() {
      flipCurrent += (flipTarget - flipCurrent) * 0.16;
      const hovering = !dragging && mouse.x > -1000;
      if (hovering) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Use window mouse for sheen (card rect is in window coords)
        const windowMouse = windowMouseRef.current;
        const dx = Math.max(-1, Math.min(1, (windowMouse.x - cx) / (rect.width / 2)));
        const dy = Math.max(-1, Math.min(1, (windowMouse.y - cy) / (rect.height / 2)));
        tiltTarget.y = dx * MAX_TILT;
        tiltTarget.x = -dy * MAX_TILT;
        const mx = Math.max(0, Math.min(100, ((windowMouse.x - rect.left) / rect.width) * 100));
        const my = Math.max(0, Math.min(100, ((windowMouse.y - rect.top) / rect.height) * 100));
        card.style.setProperty("--mx", mx + "%");
        card.style.setProperty("--my", my + "%");
        card.classList.add("idcl-hovering");
      } else {
        tiltTarget.x = 0;
        tiltTarget.y = 0;
        card.classList.remove("idcl-hovering");
      }
      tiltCurrent.x += (tiltTarget.x - tiltCurrent.x) * 0.12;
      tiltCurrent.y += (tiltTarget.y - tiltCurrent.y) * 0.12;
      flipper.style.transform = `rotateY(${flipCurrent + tiltCurrent.y}deg) rotateX(${tiltCurrent.x}deg)`;
    }

    // Track window mouse position for sheen calc (card rect is window-relative)
    const windowMouseRef = { current: { x: -9999, y: -9999 } };

    let raf = 0;
    function loop() {
      updatePoints();
      applyConstraints();
      drawRope();
      drawClip();
      positionCard();
      updateTiltAndSheen();
      raf = requestAnimationFrame(loop);
    }

    const onCardDown = (e) => {
      if (e.target.closest("a")) return;
      e.preventDefault();
      dragging = true;
      setInteracted(true);
      card.setPointerCapture(e.pointerId);
      const pos = clampToContainer(toLocal(e.clientX, e.clientY));
      pointer = pos;
      lastPointer = pos;
      downPos = pos;
    };

    const onWindowMove = (e) => {
      windowMouseRef.current = { x: e.clientX, y: e.clientY };
      mouse = toLocal(e.clientX, e.clientY);
      if (!dragging) return;
      const pos = clampToContainer(toLocal(e.clientX, e.clientY));
      velocity.x = pos.x - lastPointer.x;
      velocity.y = pos.y - lastPointer.y;
      lastPointer = pos;
      pointer = pos;
    };

    const onWindowUp = (e) => {
      if (!dragging) return;
      dragging = false;
      const pos = toLocal(e.clientX, e.clientY);
      const dist = Math.hypot(pos.x - downPos.x, pos.y - downPos.y);
      if (dist < TAP_THRESHOLD) {
        flipped = !flipped;
        flipTarget = flipped ? 180 : 0;
        const last = points[points.length - 1];
        last.oldx = last.x;
        last.oldy = last.y;
        return;
      }
      const last = points[points.length - 1];
      last.oldx = last.x - velocity.x;
      last.oldy = last.y - velocity.y;
    };

    const onPointerLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    const onResize = () => {
      resize();
      // Re-anchor pinned point to new center
      points[0].x = anchor.x;
      points[0].y = 0;
    };

    // Use ResizeObserver to catch container size changes (e.g. layout reflow)
    const resizeObs = new ResizeObserver(() => onResize());
    resizeObs.observe(root);

    card.addEventListener("pointerdown", onCardDown);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("resize", onResize);
    root.addEventListener("pointerleave", onPointerLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      card.removeEventListener("pointerdown", onCardDown);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={`idcl-root ${className}`} style={{ "--idcl-z": zIndex }}>
      <style>{CSS}</style>
      <div className="idcl-stage" ref={sceneRef}>
        <canvas className="idcl-rope" ref={canvasRef} />
        <div className="idcl-rail" ref={railRef} />
        <div className="idcl-card" ref={cardRef}>
          <div className="idcl-flipper" ref={flipperRef}>
            {/* FRONT */}
            <div className="idcl-face idcl-front">
              <div className="idcl-hole" />
              <div className="idcl-holo" />
              <div className="idcl-header">
                <div className="idcl-brand">
                  <span className="idcl-brand-mark">▲</span>
                  <div className="idcl-brand-text">
                    <b>{brand}</b>
                    <small>{brandTagline}</small>
                  </div>
                </div>
                <div className="idcl-pillars">
                  {pillars.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                  <i />
                </div>
              </div>
              <div className="idcl-photo">
                {photoUrl ? (
                  <Image src={photoUrl} alt={name} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                ) : (
                  <svg viewBox="0 0 182 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <linearGradient id="idcl-faceGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#8fb0ff" />
                        <stop offset="1" stopColor="#3f5fd8" />
                      </linearGradient>
                      <pattern id="idcl-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="0.8" fill="#ffffff" opacity="0.35" />
                      </pattern>
                    </defs>
                    <rect width="182" height="100" fill="#12151c" />
                    <circle cx="91" cy="62" r="46" fill="url(#idcl-faceGrad)" />
                    <path d="M42,46 Q91,-18 140,46 L140,66 Q91,38 42,66 Z" fill="#1c2029" />
                    <circle cx="72" cy="62" r="3.6" fill="#12151c" />
                    <circle cx="110" cy="62" r="3.6" fill="#12151c" />
                    <path d="M75,78 Q91,86 107,78" stroke="#12151c" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                    <rect width="182" height="100" fill="url(#idcl-dots)" />
                  </svg>
                )}
                <span className="idcl-verified">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                </span>
              </div>
              <h2 className="idcl-name">{name}</h2>
              <p className="idcl-role">{role}</p>
              <div className="idcl-divider" />
              <div className="idcl-idrow">
                <div className="idcl-idrow-labels">
                  <div><span>ID</span><b>{idNumber}</b></div>
                  <div><span>Location</span><b>{location}</b></div>
                  <div><span>Valid Thru</span><b>{validThru}</b></div>
                </div>
                <div className="idcl-qr idcl-small" ref={qrFrontRef} />
              </div>
              <div className="idcl-footer">
                Build<i>·</i>Ship<i>·</i>Iterate
              </div>
            </div>

            {/* BACK */}
            <div className="idcl-face idcl-back">
              <div className="idcl-hole" />
              <div className="idcl-holo" />
              <div className="idcl-stripe" />
              <div className="idcl-idnum">
                <span>NO. {idNumber}</span>
                <em>VALID {validThru}</em>
              </div>
              <div className="idcl-barcode" ref={barcodeRef} />
              <div className="idcl-backrow">
                <div className="idcl-qr" ref={qrBackRef} />
                <div className="idcl-scan">
                  <b>Scan for portfolio</b>
                  {site}<br />
                  Full case studies,<br />
                  source &amp; credits.
                </div>
              </div>
              {(githubUrl || linkedinUrl || instagramUrl) && (
                <div className="idcl-connect">
                  <span>Connect</span>
                  <div className="idcl-connect-icons">
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                    {instagramUrl && (
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="idcl-sig">
                <div className="idcl-script">{name}</div>
                <small>Authorized Signature</small>
              </div>
            </div>
          </div>
        </div>

        {showHint && (
          <div className={`idcl-hint ${interacted ? "idcl-hint-hidden" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 3v18M7 8l-4 4 4 4M17 8l4 4-4 4" />
            </svg>
            Drag to swing · Click to flip
          </div>
        )}
      </div>
    </div>
  );
}

export default IDCardLanyard;
