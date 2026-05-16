// ─── CURSOR ───────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  cursor.style.left = mx+'px'; cursor.style.top = my+'px';
  rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animCursor);
})();

// ─── HERO CANVAS ──────────────────────────────────────────
(function heroScene() {
  const canvas = document.getElementById('canvas3d');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], time = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random()*2000-1000,
      y: Math.random()*2000-1000,
      z: Math.random()*2000,
      ox: 0, oy: 0
    });
  }

  function project(x, y, z) {
    const fov = 600;
    const scale = fov / (fov + z);
    return { x: x*scale + W/2, y: y*scale + H/2, scale };
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX/window.innerWidth - 0.5)*2;
    mouseY = (e.clientY/window.innerHeight - 0.5)*2;
  });

  function draw() {
    ctx.clearRect(0,0,W,H);
    time += 0.008;
    const camX = mouseX*120, camY = mouseY*80;
    const sorted = [...particles].sort((a,b) => b.z - a.z);

    for (let i = 0; i < sorted.length; i++) {
      for (let j = i+1; j < Math.min(i+6, sorted.length); j++) {
        const p1 = sorted[i], p2 = sorted[j];
        const dx = p1.x-p2.x, dy = p1.y-p2.y, dz = p1.z-p2.z;
        const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
        if (dist < 300) {
          const a = (1-dist/300)*0.08;
          const pp1 = project(p1.x-camX, p1.y-camY, p1.z);
          const pp2 = project(p2.x-camX, p2.y-camY, p2.z);
          ctx.beginPath();
          ctx.moveTo(pp1.x, pp1.y);
          ctx.lineTo(pp2.x, pp2.y);
          ctx.strokeStyle = `rgba(200,190,170,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    sorted.forEach((p, i) => {
      p.z -= 1.2;
      if (p.z < 0) { p.z = 2000; p.x = Math.random()*2000-1000; p.y = Math.random()*2000-1000; }
      const pp = project(p.x-camX, p.y-camY, p.z);
      const alpha = (1-p.z/2000)*0.7;
      const size  = pp.scale*2;
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(220,210,190,${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── DONNÉES PROJETS ──────────────────────────────────────
const projects = {
  1: {nom:"Histoire des Arts",cat:"Illustration \u00b7 Photoshop",desc:"Analyser des \u0153uvres artistiques de la Pr\u00e9histoire jusqu'\u00e0 la Renaissance et faire le lien avec le jeu vid\u00e9o. Rendu : mini pr\u00e9sentation d'\u0153uvre + prototype avec id\u00e9e de gameplay.",outils:["Photoshop"],date:"07/11/2025",images:["assets/images/img_043.jpg"]},
  2: {nom:"Digital Paint N&B",cat:"Illustration \u00b7 Photoshop",desc:"R\u00e9aliser une illustration noir et blanc \u2014 apprentissage du croquis, lineart, ombres et lumi\u00e8res. Rendu : 6 vignettes N&B + un paint du cr\u00e2ne humain.",outils:["Photoshop"],date:"24/10/2025",images:["assets/images/img_042.jpg","assets/images/img_041.jpg","assets/images/img_040.jpg"]},
  3: {nom:"Digital Paint Couleur",cat:"Illustration \u00b7 Photoshop",desc:"R\u00e9aliser une illustration couleur \u2014 travail sur la lumi\u00e8re et la colorisation. Rendu : 3 sph\u00e8res color\u00e9es, colorisation d'une image N&B, 3 cubes avec mat\u00e9riaux diff\u00e9rents.",outils:["Photoshop"],date:"31/10/2025",images:["assets/images/img_039.jpg","assets/images/img_038.jpg"]},
  4: {nom:"Props Art 3D",cat:"3D \u00b7 Maya \u00b7 Substance Painter",desc:"Mod\u00e9liser en 3D un m\u00e9tier ancien avec au minimum 5 objets li\u00e9s au m\u00eame m\u00e9tier. Travail de mod\u00e9lisation, texturing et pr\u00e9sentation dans Unreal Engine 5.",outils:["Maya","Unreal Engine 5","Substance Painter"],date:"18/02/2026",images:["assets/images/img_037.jpg",
    "assets/images/img_036.jpg",
    "assets/images/img_035.jpg",
    "assets/images/img_034.jpg",
    "assets/images/img_033.jpg",
    "assets/images/img_032.jpg",
    "assets/images/img_031.jpg",
    "assets/images/img_030.jpg",
    "assets/images/img_029.jpg",
    "assets/images/img_028.jpg",
    "assets/images/img_027.jpg"]},
  5: {nom:"Level Art \u2013 Unreal Engine",cat:"Level Art \u00b7 Unreal Engine 5",desc:"Cr\u00e9er une sc\u00e8ne statique dans Unreal Engine sur le th\u00e8me d'un m\u00e9tier d'antan \u2014 mise en valeur des props 3D avec lighting, composition et ambiance photor\u00e9aliste.",outils:["Unreal Engine 5","Substance Painter"],date:"27/02/2026",images:["assets/images/img_026.jpg","assets/images/img_025.jpg","assets/images/img_024.jpg","assets/images/img_023.jpg"]},
  6: {nom:"Mini Studio \u2013 Reskin 2D",cat:"Game Art \u00b7 Photoshop",desc:"Reskin complet d'un jeu 2D en \u00e9quipe \u2014 remplacement de tous les assets visuels, ajout d'une nouvelle m\u00e9canique de gameplay. Rendu : jeu jouable + vid\u00e9o de gameplay.",outils:["Photoshop"],date:"18/03/2026",images:["assets/images/img_022.jpg","assets/images/img_021.jpg"]},
  7: {nom:"Jeu de Plateau",cat:"Game Design \u00b7 Photoshop",desc:"Finaliser un jeu de plateau cr\u00e9\u00e9 en groupe \u2014 cr\u00e9ation des \u00e9l\u00e9ments graphiques, game design et UX design. Soutenance finale en groupe.",outils:["Photoshop"],date:"2026",images:["assets/images/img_020.jpg","assets/images/img_019.jpg"]},
  8: {nom:"Ice & King \u2013 Challenge",cat:"3D \u00b7 Maya \u00b7 Substance Painter",desc:"\u00c9p\u00e9e produite lors d'un challenge entre \u00e9tudiants G.Art 1\u00e8re ann\u00e9e, th\u00e8me impos\u00e9 : ICE & KING. Mod\u00e9lisation, texturing et rendu dans Unreal Engine 5.",outils:["Maya","Substance Painter","Unreal Engine 5"],date:"28/02/2026",images:["assets/images/img_018.jpg"]},
  9: {nom:"VFX Niagara Aura",cat:"VFX \u00b7 Unreal Engine 5",desc:"Effet d'aura VFX r\u00e9alis\u00e9 avec le syst\u00e8me Niagara d'Unreal Engine 5. Travail sur les particules, l'\u00e9mission de lumi\u00e8re et les shaders pour cr\u00e9er une aura mystique en temps r\u00e9el.",outils:["Unreal Engine 5","Niagara"],date:"2026", youtube:"ZNYxmYvNbwU",images:["assets/images/img_017.jpg","assets/images/img_016.jpg","assets/images/img_015.jpg"]},
  10: {nom:"Ice Spike \u2013 Niagara",cat:"VFX \u00b7 Unreal Engine 5",desc:"Simulation de pics de glace avec le syst\u00e8me Niagara d'Unreal Engine 5. Effets de cristallisation, particules de givre et impact au sol avec onde de choc gel\u00e9e.",outils:["Unreal Engine 5","Niagara"],date:"2026", youtube:"OVWdHmje1iM",images:["assets/images/img_014.jpg","assets/images/img_013.jpg"]},
  11: {nom:"Magical Circle \u2013 Niagara",cat:"VFX \u00b7 Unreal Engine 5",desc:"Cercle magique r\u00e9alis\u00e9 avec le syst\u00e8me Niagara d'Unreal Engine 5. Combinaison de particules, mat\u00e9riaux \u00e9missifs et animations proc\u00e9durales pour un effet de sort en temps r\u00e9el.",outils:["Unreal Engine 5","Niagara"],date:"2026", youtube:"_Bd8ez9_fao",images:["assets/images/img_012.jpg","assets/images/img_011.jpg","assets/images/img_010.jpg","assets/images/img_009.jpg","assets/images/img_008.jpg","assets/images/img_007.jpg"]}
};
// ─── SOMMAIRES ────────────────────────────────────────────
const categories = ['3D · Modélisation','VFX · Simulation','Animation 3D','Level Art','Environment','VFX · Motion'];
const icons = [
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2 L12 22 M2 12 L22 12"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M5 3l14 9-14 9V3z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18 M9 21V9"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M3 17 Q7 10 12 12 Q17 14 21 7"/><path d="M3 21 L21 21"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"/></svg>`,
];

const grid = document.getElementById('sommaireGrid');
for (let i = 1; i <= 11; i++) {
  const pData = projects[i];
  const cat = pData ? pData.cat : categories[(i-1) % categories.length];
  const icon = icons[(i-1) % icons.length];
  const cardTitle = pData ? pData.nom : `Projet ${String(i).padStart(2,'0')}`;
  const isReady = !!pData;
  const card = document.createElement('div');
  card.className = 'sommaire-card reveal';
  card.style.transitionDelay = ((i-1) % 5) * 0.05 + 's';
  card.innerHTML = `
    <div class="sommaire-num">${String(i).padStart(2,'0')}</div>
    <div class="sommaire-status${isReady ? '' : ' empty'}"></div>
    <div class="sommaire-thumb">${icon}</div>
    ${isReady && pData.images && pData.images[0] ? `<img src="${pData.images[0]}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.25;">` : ''}
    <div class="sommaire-bottom">
      <p class="sommaire-title">${cardTitle}</p>
      <p class="sommaire-cat">${cat}</p>
    </div>
    <div class="sommaire-add">
      <span>${isReady ? '→' : '+'}</span>
      <p>${isReady ? 'Voir' : 'À venir'}</p>
    </div>`;
  card.addEventListener('click', () => openDetail(i));
  grid.appendChild(card);
}

// ─── PAGE DÉTAIL ──────────────────────────────────────────
const detailPage = document.getElementById('detail-page');
const detailBack = document.getElementById('detailBack');
let currentDetail = 1;

function openDetail(num) {
  currentDetail = num;
  const numStr = String(num).padStart(2,'0');
  const pData = projects[num];
  const cat = pData ? pData.cat : categories[(num-1) % categories.length];
  const nom = pData ? pData.nom : `Projet ${numStr}`;

  document.getElementById('detailBreadNum').textContent = `Projet ${numStr}`;
  document.getElementById('detailBigNum').textContent   = numStr;
  document.getElementById('detailTitle').textContent    = nom;
  document.getElementById('detailCat').textContent      = cat;
  document.getElementById('detailDesc').textContent     = pData ? pData.desc : "Ce projet est en cours de préparation.";
  document.getElementById('detailDate').textContent     = pData && pData.date ? pData.date : '—';

  const tagsEl = document.getElementById('detailTags');
  tagsEl.innerHTML = pData ? pData.outils.map(t => `<span class="detail-tag">${t}</span>`).join('') : '<span class="detail-tag">À définir</span>';

  // Média carousel
  const mediaEl = document.getElementById('detailMedia');
  const placeholder = document.getElementById('detailMediaPlaceholder');
  mediaEl.querySelectorAll('.detail-carousel').forEach(e => e.remove());
  mediaEl.querySelectorAll('iframe').forEach(e => e.remove());

  // Zone screenshots sous la vidéo
  const existingShots = document.getElementById('detailScreenshots');
  if (existingShots) existingShots.remove();

  if (pData && pData.youtube) {
    placeholder.style.display = 'none';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${pData.youtube}?autoplay=0&rel=0`;
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    mediaEl.appendChild(iframe);

    // Si images dispo, les afficher en grille sous la vidéo
    if (pData.images && pData.images.length > 0) {
      const shots = document.createElement('div');
      shots.id = 'detailScreenshots';
      shots.style.cssText = 'margin-top:16px;';
      const label = document.createElement('p');
      label.style.cssText = 'font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:12px;';
      label.textContent = 'Screenshots';
      shots.appendChild(label);
      const grid = document.createElement('div');
      grid.style.cssText = `display:grid;grid-template-columns:repeat(${Math.min(pData.images.length,3)},1fr);gap:8px;`;
      pData.images.forEach((src, idx) => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'aspect-ratio:16/9;overflow:hidden;border:1px solid rgba(255,255,255,0.06);cursor:pointer;';
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform 0.3s;';
        wrap.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
        wrap.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
        // Clic = plein écran lightbox simple
        wrap.addEventListener('click', () => {
          const lb = document.createElement('div');
          lb.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
          const lbImg = document.createElement('img');
          lbImg.src = src;
          lbImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;';
          lb.appendChild(lbImg);
          lb.addEventListener('click', () => lb.remove());
          document.body.appendChild(lb);
        });
        wrap.appendChild(img);
        grid.appendChild(wrap);
      });
      shots.appendChild(grid);
      mediaEl.parentNode.insertBefore(shots, mediaEl.nextSibling);
    }
  } else if (pData && pData.images && pData.images.length > 0) {
    placeholder.style.display = 'none';
    const carousel = document.createElement('div');
    carousel.className = 'detail-carousel';
    carousel.style.cssText = 'width:100%;height:100%;position:relative;';
    let carIdx = 0;
    pData.images.forEach((src, idx) => {
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#0a0a0a;transition:opacity 0.4s;opacity:${idx===0?1:0};`;
      carousel.appendChild(img);
    });
    if (pData.images.length > 1) {
      const counter = document.createElement('span');
      counter.style.cssText = 'position:absolute;bottom:12px;right:16px;font-size:0.65rem;letter-spacing:0.12em;color:rgba(255,255,255,0.5);z-index:5;font-family:monospace;';
      counter.textContent = `01 / ${String(pData.images.length).padStart(2,'0')}`;
      const imgs = carousel.querySelectorAll('img');
      ['←','→'].forEach((arrow, dir) => {
        const btn = document.createElement('button');
        btn.textContent = arrow;
        btn.style.cssText = `position:absolute;${dir===0?'left':'right'}:12px;top:50%;transform:translateY(-50%);z-index:5;background:rgba(8,8,8,0.7);border:1px solid rgba(255,255,255,0.15);color:white;width:36px;height:36px;cursor:pointer;font-size:1rem;`;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          imgs[carIdx].style.opacity = 0;
          carIdx = (carIdx + (dir===0?-1:1) + pData.images.length) % pData.images.length;
          imgs[carIdx].style.opacity = 1;
          counter.textContent = `${String(carIdx+1).padStart(2,'0')} / ${String(pData.images.length).padStart(2,'0')}`;
        });
        carousel.appendChild(btn);
      });
      carousel.appendChild(counter);
    }
    mediaEl.appendChild(carousel);
  } else {
    placeholder.style.display = 'flex';
  }

  detailPage.classList.add('open');
  detailPage.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  detailPage.classList.remove('open');
  document.body.style.overflow = '';
}

detailBack.addEventListener('click', closeDetail);
document.getElementById('detailPrev').addEventListener('click', () => openDetail(currentDetail > 1 ? currentDetail - 1 : 30));
document.getElementById('detailNext').addEventListener('click', () => openDetail(currentDetail < 30 ? currentDetail + 1 : 1));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

// ─── GEOMETRY DASH CACHÉ ──────────────────────────────────
(function() {
  const gdGame   = document.getElementById('gd-game');
  const gdCanvas = document.getElementById('gd-canvas');
  const gdScore  = document.getElementById('gd-score');
  const gdDead   = document.getElementById('gd-dead');
  const gdFinal  = document.getElementById('gd-final');
  const ctx      = gdCanvas.getContext('2d');

  const isMobile = window.innerWidth < 768;
  const W = isMobile ? window.innerWidth : 800;
  const H = isMobile ? 240 : 360;
  const S = 64;
  gdCanvas.width = W; gdCanvas.height = H;

  function img(src) { const i = new Image(); i.src = src; return i; }
  const imgBG    = img("assets/images/img_006.jpg");
  const imgF1 = img("assets/images/img_005.png");
  const imgF2 = img("assets/images/img_005.png");
  const imgP1    = img("assets/images/img_004.png");
  const imgP2    = img("assets/images/img_003.png");
  const imgP3    = img("assets/images/img_002.png");
  const imgSpike = img("assets/images/img_001.png");

  const FLOOR_Y = H - S;   // le sol commence ici
  const P1W = 240, P2W = 173, P3W = 233;
  const TOTAL_FLOOR_W = P1W + P2W + P3W; // largeur d'un cycle complet

  let gameRunning=false, raf;
  let player, obstacles, particles, dist, speed, frameCount, frameIdx, frameTimer, scroll;

  function openGame() {
    gdGame.style.display='flex';
    gdDead.style.display='none';
    document.body.style.overflow='hidden';
    startGame();
  }

  function startGame() {
    player = {x:100, y:FLOOR_Y-S, w:S, h:S, vy:0, onGround:true, rotation:0};
    obstacles=[]; particles=[]; dist=0; speed=4;
    frameCount=0; frameIdx=0; frameTimer=0; scroll=0;
    gameRunning=true;
    if(raf) cancelAnimationFrame(raf);
    loop();
  }

  function jump() {
    if(!gameRunning) return;
    if(player.onGround) {
      player.vy=-13; player.onGround=false;
      for(let i=0;i<6;i++) particles.push({x:player.x+S/2,y:player.y+S,vx:(Math.random()-0.5)*3,vy:-Math.random()*3,life:18,color:'rgba(255,220,80,0.8)'});
    }
  }

  const patterns = [
    [{x:0}],
    [{x:0},{x:80}],
    [{x:0},{x:75},{x:150}],
    [{x:0},{x:90}],
  ];

  function spawnObstacle() {
    const pat = patterns[Math.floor(Math.random()*patterns.length)];
    pat.forEach(p => obstacles.push({x:W+p.x, y:FLOOR_Y-S, w:S, h:S}));
  }

  function drawBG() {
    // Fond
    if(imgBG.complete && imgBG.naturalWidth>0)
      ctx.drawImage(imgBG, 0, 0, W, FLOOR_Y);
    else { ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,0,W,FLOOR_Y); }

    // Sol : tiles P1+P2+P3 en boucle
    const platforms = [
      {img:imgP1, w:P1W},
      {img:imgP2, w:P2W},
      {img:imgP3, w:P3W},
    ];
    let ox = -(scroll % TOTAL_FLOOR_W);
    // Dessiner 3 cycles pour couvrir largement
    for(let rep=0; rep<3; rep++) {
      let cx = ox + rep * TOTAL_FLOOR_W;
      for(const p of platforms) {
        if(cx + p.w > 0 && cx < W) {
          if(p.img.complete && p.img.naturalWidth>0)
            ctx.drawImage(p.img, cx, FLOOR_Y, p.w, S);
          else { ctx.fillStyle='#2d2d6b'; ctx.fillRect(cx, FLOOR_Y, p.w, S); }
        }
        cx += p.w;
      }
    }
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x+S/2, player.y+S/2);
    ctx.rotate(player.rotation*Math.PI/180);
    const curFrame = frameIdx===0 ? imgF1 : imgF2;
    if(curFrame.complete && curFrame.naturalWidth>0)
      ctx.drawImage(curFrame, 0, 0, curFrame.naturalWidth, curFrame.naturalHeight, -S/2, -S/2, S, S);
    else { ctx.fillStyle='#6c63ff'; ctx.fillRect(-S/2,-S/2,S,S); }
    ctx.restore();
  }

  function drawObstacle(ob) {
    if(imgSpike.complete && imgSpike.naturalWidth>0)
      ctx.drawImage(imgSpike, ob.x, ob.y, ob.w, ob.h);
    else { ctx.fillStyle='#ff6b6b'; ctx.fillRect(ob.x,ob.y,ob.w,ob.h); }
  }

  function collides(p,ob) {
    const m=10;
    return p.x+m<ob.x+ob.w-m && p.x+p.w-m>ob.x+m && p.y+m<ob.y+ob.h && p.y+p.h-m>ob.y+m;
  }

  function die() {
    gameRunning=false;
    for(let i=0;i<20;i++) {
      const a2=(i/20)*Math.PI*2;
      particles.push({x:player.x+S/2,y:player.y+S/2,vx:Math.cos(a2)*6,vy:Math.sin(a2)*6,life:40,color:`hsl(${i*18},100%,60%)`});
    }
    setTimeout(()=>{
      lastScore = Math.floor(dist);
      gdFinal.textContent = `Distance : ${lastScore}m`;
      gdDead.style.display='flex';
      showPanel('submit');
      document.getElementById('gd-name-input').value='';
      setTimeout(()=>document.getElementById('gd-name-input').focus(), 100);
    }, 600);
  }

  function loop() {
    raf=requestAnimationFrame(loop);
    frameCount++;

    if(gameRunning) {
      frameTimer++;
      if(frameTimer%8===0) frameIdx=(frameIdx+1)%2;

      player.vy+=0.65; player.y+=player.vy;
      // pas de rotation au saut

      if(player.y>=FLOOR_Y-S) {
        player.y=FLOOR_Y-S; player.vy=0;
        player.onGround=true;
      }

      const interval=Math.max(50,85-Math.floor(dist/40));
      if(frameCount%interval===0) spawnObstacle();
      obstacles.forEach(ob=>ob.x-=speed);
      obstacles=obstacles.filter(ob=>ob.x+ob.w>-10);

      for(const ob of obstacles) { if(collides(player,ob)){ die(); break; } }

      scroll+=speed;
      dist+=speed*0.05;
      speed=4+dist*0.018;
      gdScore.textContent=Math.floor(dist)+'m';

      if(player.onGround&&frameCount%4===0)
        particles.push({x:player.x,y:player.y+S,vx:-1.5,vy:-Math.random()*1.5,life:12,color:'rgba(255,200,80,0.4)'});
    }

    particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life--;});
    particles=particles.filter(p=>p.life>0);

    drawBG();
    particles.forEach(p=>{ctx.globalAlpha=p.life/40;ctx.fillStyle=p.color;ctx.fillRect(p.x-3,p.y-3,6,6);});
    ctx.globalAlpha=1;
    obstacles.forEach(drawObstacle);
    drawPlayer();
  }

  document.addEventListener('keydown',e=>{
    if(gdGame.style.display!=='none'&&(e.code==='Space'||e.code==='ArrowUp')){e.preventDefault();jump();}
  });
  gdCanvas.addEventListener('click',jump);
  gdCanvas.addEventListener('touchstart',e=>{e.preventDefault();jump();});
  document.getElementById('gd-close').addEventListener('click',()=>{
    gdGame.style.display='none'; gameRunning=false;
    if(raf) cancelAnimationFrame(raf);
    document.body.style.overflow='';
  });
  // ─── SCOREBOARD ───────────────────────────────────────
  const SCORES_KEY = 'gd_scores_briantly';
  let lastScore = 0;

  function getScores() {
    try { return JSON.parse(localStorage.getItem(SCORES_KEY)) || []; }
    catch(e) { return []; }
  }

  function saveScore(name, score) {
    const scores = getScores();
    scores.push({ name: name.trim() || 'Anonyme', score, date: new Date().toLocaleDateString('fr-FR') });
    scores.sort((a,b) => b.score - a.score);
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, 20)));
  }

  function renderScores() {
    const scores = getScores();
    const list = document.getElementById('gd-scores-list');
    list.innerHTML = '';
    if (!scores.length) {
      list.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-family:DM Mono,monospace;font-size:0.72rem;text-align:center;padding:16px;">Aucun score enregistré</p>';
      return;
    }
    scores.forEach((s, i) => {
      const isMe = (s.score === lastScore && i === scores.findIndex(x => x.score === lastScore));
      const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}.`;
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:center;gap:12px;padding:8px 16px;background:${isMe?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.03)'};border:1px solid ${isMe?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.06)'};`;
      row.innerHTML = `<span style="font-weight:800;font-size:0.85rem;color:rgba(255,255,255,0.4);min-width:28px;font-family:Syne,sans-serif;">${medal}</span><span style="font-family:Syne,sans-serif;font-weight:700;font-size:0.9rem;color:white;flex:1;">${s.name}</span><span style="font-family:DM Mono,monospace;font-size:0.8rem;color:rgba(255,255,255,0.6);">${s.score}m</span><span style="font-family:DM Mono,monospace;font-size:0.6rem;color:rgba(255,255,255,0.25);">${s.date}</span>`;
      list.appendChild(row);
    });
  }

  function showPanel(panel) {
    document.getElementById('gd-panel-submit').style.display = panel==='submit' ? 'flex' : 'none';
    document.getElementById('gd-panel-scores').style.display = panel==='scores' ? 'flex' : 'none';
  }

  document.getElementById('gd-submit-score').addEventListener('click', () => {
    const name = document.getElementById('gd-name-input').value;
    saveScore(name, lastScore);
    renderScores();
    showPanel('scores');
  });

  document.getElementById('gd-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('gd-submit-score').click();
  });

  document.getElementById('gd-quit-submit').addEventListener('click', () => {
    gdDead.style.display = 'none';
    gdGame.style.display = 'none';
    gameRunning = false;
    if(raf) cancelAnimationFrame(raf);
    document.body.style.overflow = '';
  });

  document.getElementById('gd-skip').addEventListener('click', () => {
    renderScores();
    showPanel('scores');
  });

  document.getElementById('gd-back-submit').addEventListener('click', () => {
    showPanel('submit');
  });

  document.getElementById('gd-restart').addEventListener('click', () => {
    gdDead.style.display = 'none';
    showPanel('submit');
    startGame();
  });

  window.openGDGame = openGame;
})();

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e=>{ if(e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

// Easter egg : clic sur le titre dans la page détail quand projet 6
document.getElementById('detailTitle').addEventListener('click', () => {
  if (currentDetail === 6) {
    if (window.openGDGame) {
      closeDetail();
      setTimeout(window.openGDGame, 400);
    }
  }
});

// Hint visuel : curseur pointer sur le titre quand projet 6
document.getElementById('detailTitle').addEventListener('mouseenter', () => {
  if (currentDetail === 6) document.getElementById('detailTitle').style.cursor = 'pointer';
});
document.getElementById('detailTitle').addEventListener('mouseleave', () => {
  document.getElementById('detailTitle').style.cursor = 'default';
});
