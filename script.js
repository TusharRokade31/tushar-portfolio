/* =========================================================
   Tushar Rokade — Portfolio
   Three.js hero + GSAP motion + Lenis smooth scroll
   ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const isTouch = window.matchMedia("(hover: none)").matches

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
  }

  initSmoothScroll()
  initMobileMenu()
  initNavState()
  initCursor()
  initMagnetic()
  initTilt()
  initRoleRotator()
  initHeroScene()
  runLoader()
  setYear()
})

/* ---------- Loader ---------- */
function runLoader() {
  const loader = document.getElementById("loader")
  const count = document.getElementById("loader-count")
  const bar = document.querySelector(".loader-bar")

  if (typeof gsap === "undefined" || !loader) {
    if (loader) loader.remove()
    revealAll()
    return
  }

  const state = { v: 0 }
  gsap
    .timeline()
    .to(state, {
      v: 100,
      duration: prefersReducedMotion ? 0.2 : 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count) count.textContent = Math.round(state.v).toString().padStart(3, "0")
        if (bar) bar.style.transform = `scaleX(${state.v / 100})`
      },
    })
    .to(".loader-word span", { yPercent: -110, stagger: 0.04, duration: 0.5, ease: "power3.in" })
    .to(loader, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: () => {
        loader.remove()
        animateHero()
        initScrollAnimations()
      },
    })
}

/* ---------- Smooth scroll (Lenis) ---------- */
let lenis = null
function initSmoothScroll() {
  if (typeof Lenis === "undefined" || prefersReducedMotion) return
  lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  if (typeof ScrollTrigger !== "undefined") lenis.on("scroll", ScrollTrigger.update)
  if (typeof gsap !== "undefined") {
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  } else {
    const raf = (t) => {
      lenis.raf(t)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")
      if (id.length < 2) return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      // defer so the mobile menu can close (lenis.start() resets any running scroll)
      setTimeout(() => lenis.scrollTo(target, { offset: -20, force: true }), 0)
    })
  })
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle")
  const menu = document.getElementById("mobile-menu")
  if (!toggle || !menu) return

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open)
    toggle.classList.toggle("is-open", open)
    toggle.setAttribute("aria-expanded", String(open))
    document.body.classList.toggle("menu-open", open)
    if (lenis) open ? lenis.stop() : lenis.start()
  }

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")))
  menu.querySelectorAll("a").forEach((l) => l.addEventListener("click", () => setOpen(false)))
}

/* ---------- Nav: hide on scroll down, active link ---------- */
function initNavState() {
  const nav = document.getElementById("site-nav")
  if (!nav) return
  let last = 0
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY
      nav.classList.toggle("is-scrolled", y > 40)
      nav.classList.toggle("is-hidden", y > last && y > 400)
      last = y
    },
    { passive: true },
  )

  const links = document.querySelectorAll(".nav-link")
  const sections = [...links].map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id))
      })
    },
    { rootMargin: "-45% 0px -50% 0px" },
  )
  sections.forEach((s) => io.observe(s))
}

/* ---------- Custom cursor ---------- */
function initCursor() {
  if (isTouch || prefersReducedMotion) return
  const dot = document.querySelector(".cursor-dot")
  const ring = document.querySelector(".cursor-ring")
  if (!dot || !ring) return
  document.body.classList.add("has-cursor")

  let mx = innerWidth / 2,
    my = innerHeight / 2,
    rx = mx,
    ry = my
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX
    my = e.clientY
    dot.style.transform = `translate(${mx}px, ${my}px)`
  })
  const loop = () => {
    rx += (mx - rx) * 0.16
    ry += (my - ry) * 0.16
    ring.style.transform = `translate(${rx}px, ${ry}px)`
    requestAnimationFrame(loop)
  }
  loop()

  document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-hover")
      const label = el.getAttribute("data-cursor")
      if (label) {
        ring.dataset.label = label
        ring.classList.add("has-label")
      }
    })
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-hover", "has-label")
    })
  })
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (isTouch || prefersReducedMotion || typeof gsap === "undefined") return
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      gsap.to(el, { x: x * 0.3, y: y * 0.35, duration: 0.4, ease: "power3.out" })
    })
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" }))
  })
}

/* ---------- 3D tilt on project shots ---------- */
function initTilt() {
  if (isTouch || prefersReducedMotion) return
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const inner = el.querySelector(".browser")
    if (!inner) return
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      inner.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translateZ(0)`
      inner.style.setProperty("--gx", `${(px + 0.5) * 100}%`)
      inner.style.setProperty("--gy", `${(py + 0.5) * 100}%`)
    })
    el.addEventListener("mouseleave", () => {
      inner.style.transform = ""
    })
  })
}

/* ---------- Rotating hero role ---------- */
function initRoleRotator() {
  const wrap = document.querySelector(".role-rotator")
  if (!wrap) return
  const items = [...wrap.querySelectorAll("span")]
  if (!items.length) return
  let i = 0
  items[0].classList.add("is-active")
  if (items.length < 2 || prefersReducedMotion) return
  setInterval(() => {
    items[i].classList.remove("is-active")
    items[i].classList.add("is-leaving")
    const prev = items[i]
    setTimeout(() => prev.classList.remove("is-leaving"), 700)
    i = (i + 1) % items.length
    items[i].classList.add("is-active")
  }, 2400)
}

/* ---------- Hero intro animation ---------- */
function animateHero() {
  if (typeof gsap === "undefined") return revealAll()

  // split hero name into characters
  document.querySelectorAll(".split-chars").forEach((el) => {
    const text = el.textContent
    el.textContent = ""
    el.setAttribute("aria-label", text)
    ;[...text].forEach((ch) => {
      const s = document.createElement("span")
      s.className = "char"
      s.setAttribute("aria-hidden", "true")
      s.textContent = ch === " " ? " " : ch
      el.appendChild(s)
    })
  })

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
  tl.set(".hero-anim", { autoAlpha: 1 })
    .from(".hero-badge", { y: 20, autoAlpha: 0, duration: 0.8 })
    .from(".hero-name .char", { yPercent: 115, rotate: 8, duration: 1.1, stagger: 0.035 }, "-=0.5")
    .from(".hero-role", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.7")
    .from(".hero-text", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.6")
    .from(".hero-buttons > *", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
    .from(".hero-stat", { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.5")
    .from(".hero-scroll, .hero-side", { autoAlpha: 0, duration: 1 }, "-=0.4")

  // count-up stats
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count)
    const o = { v: 0 }
    gsap.to(o, {
      v: end,
      duration: 2,
      delay: 1.2,
      ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-IN")),
    })
  })
}

function revealAll() {
  document.querySelectorAll(".hero-anim, .reveal").forEach((el) => {
    el.style.opacity = 1
    el.style.visibility = "visible"
    el.style.transform = "none"
  })
}

/* ---------- Scroll animations ---------- */
function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return revealAll()

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 60, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    )
  })

  // section headings: line mask reveal
  gsap.utils.toArray(".section-heading .line-inner").forEach((el) => {
    gsap.from(el, {
      yPercent: 110,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    })
  })

  // project media: clip reveal (once) + image parallax
  gsap.utils.toArray(".project-media").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(10% 10% 10% 10% round 28px)", scale: 0.96 },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        scale: 1,
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onComplete: () => (el.style.clipPath = "none"),
      },
    )
  })
  gsap.utils.toArray(".project-shot").forEach((el) => {
    const img = el.querySelector("img")
    if (img)
      gsap.fromTo(
        img,
        { yPercent: 0 },
        { yPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      )
  })

  // experience timeline progress line
  const progress = document.querySelector(".timeline-progress")
  if (progress) {
    gsap.fromTo(
      progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true },
      },
    )
  }

  // big outline text drift
  gsap.utils.toArray(".drift").forEach((el) => {
    const dir = el.dataset.dir === "right" ? 1 : -1
    gsap.fromTo(
      el,
      { xPercent: dir * -10 },
      { xPercent: dir * 10, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
    )
  })

  // hero content fades as you scroll away
  gsap.to(".hero-content", {
    y: -80,
    autoAlpha: 0.2,
    ease: "none",
    scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
  })

  ScrollTrigger.refresh()
}

/* ---------- Three.js hero scene ---------- */
function initHeroScene() {
  const canvas = document.getElementById("hero-canvas")
  if (!canvas || typeof THREE === "undefined") return

  const hero = document.getElementById("home")
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x07070a, 0.045)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, 9)

  const ACCENT = new THREE.Color("#c6ff3d")
  const VIOLET = new THREE.Color("#7c5cff")

  // ---- noise-displaced blob (shader) ----
  const noiseGLSL = `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }`

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uColorA: { value: ACCENT },
    uColorB: { value: VIOLET },
  }

  const vertex = `
    uniform float uTime; uniform vec2 uMouse;
    varying float vNoise; varying vec3 vNormal2;
    ${noiseGLSL}
    void main(){
      float n = snoise(normal*1.1 + vec3(uTime*0.25, uTime*0.18, 0.0) + vec3(uMouse*0.6, 0.0));
      vNoise = n;
      vNormal2 = normal;
      vec3 pos = position + normal * n * 0.38;
      vec4 mv = modelViewMatrix * vec4(pos,1.0);
      gl_PointSize = (2.2 + n*1.6) * (9.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }`

  const frag = (isPoints) => `
    uniform vec3 uColorA; uniform vec3 uColorB;
    varying float vNoise; varying vec3 vNormal2;
    void main(){
      ${isPoints ? "vec2 c=gl_PointCoord-0.5; if(length(c)>0.5) discard;" : ""}
      vec3 col = mix(uColorB, uColorA, smoothstep(-0.6, 0.7, vNoise));
      float rim = 0.55 + 0.45*abs(vNormal2.z);
      gl_FragColor = vec4(col*rim, ${isPoints ? "0.95" : "0.16"});
    }`

  const blobGroup = new THREE.Group()
  scene.add(blobGroup)

  // evenly distributed points on a sphere (fibonacci lattice)
  const N = window.innerWidth < 768 ? 3500 : 7000
  const pPos = new Float32Array(N * 3)
  const pNor = new Float32Array(N * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    const nx = Math.cos(th) * r,
      nz = Math.sin(th) * r
    pNor.set([nx, y, nz], i * 3)
    pPos.set([nx * 2.2, y * 2.2, nz * 2.2], i * 3)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(pPos, 3))
  geo.setAttribute("normal", new THREE.BufferAttribute(pNor, 3))
  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: frag(true),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  blobGroup.add(points)

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 6),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: frag(false),
      wireframe: true,
      transparent: true,
      depthWrite: false,
    }),
  )
  blobGroup.add(wire)

  // ---- orbit rings ----
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.006, 8, 200), ringMat)
  ring1.rotation.x = Math.PI / 2.3
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.004, 8, 200), ringMat)
  ring2.rotation.set(Math.PI / 1.8, 0.4, 0)
  blobGroup.add(ring1, ring2)

  // small satellites on rings
  const satGeo = new THREE.SphereGeometry(0.06, 16, 16)
  const sat1 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: ACCENT }))
  const sat2 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: VIOLET }))
  ring1.add(sat1)
  ring2.add(sat2)

  // ---- floating wireframe shapes ----
  const floaters = []
  const shapeGeos = [
    new THREE.OctahedronGeometry(0.35),
    new THREE.TetrahedronGeometry(0.4),
    new THREE.TorusKnotGeometry(0.22, 0.06, 64, 8),
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
  ]
  // kept around the blob (right side) so they never cross the hero text
  const floatGroup = new THREE.Group()
  scene.add(floatGroup)
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(
      shapeGeos[i % shapeGeos.length],
      new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? ACCENT : 0xffffff, wireframe: true, transparent: true, opacity: 0.35 }),
    )
    const a = -Math.PI / 2 - 0.4 + (i / 7) * (Math.PI + 0.8) + (Math.random() - 0.5) * 0.3
    const r = 3.4 + Math.random() * 1.4
    m.position.set(Math.cos(a) * r, Math.sin(a) * r, -1 - Math.random() * 2.5)
    m.userData = { speed: 0.2 + Math.random() * 0.5, off: Math.random() * 10 }
    floatGroup.add(m)
    floaters.push(m)
  }

  // ---- starfield ----
  const starCount = window.innerWidth < 768 ? 900 : 2200
  const starPos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 40
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 24
    starPos[i * 3 + 2] = -Math.random() * 30
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.6, depthWrite: false }),
  )
  scene.add(stars)

  // ---- layout / resize ----
  const layout = () => {
    const w = hero.clientWidth
    const h = hero.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const mobile = w < 900
    blobGroup.position.set(mobile ? 0.6 : 3.1, mobile ? 2.3 : 0, 0)
    blobGroup.scale.setScalar(mobile ? 0.62 : 1)
    floatGroup.position.copy(blobGroup.position)
    floatGroup.scale.copy(blobGroup.scale)
  }
  layout()
  window.addEventListener("resize", layout)

  // ---- interaction ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
    mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1
  })

  let visible = true
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(hero)

  let scrollY = 0
  window.addEventListener("scroll", () => (scrollY = window.scrollY), { passive: true })

  const clock = new THREE.Clock()
  const speed = prefersReducedMotion ? 0.2 : 1

  const tick = () => {
    requestAnimationFrame(tick)
    if (!visible) return
    const t = clock.getElapsedTime() * speed

    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05
    uniforms.uTime.value = t
    uniforms.uMouse.value.set(mouse.x, mouse.y)

    blobGroup.rotation.y = t * 0.12 + mouse.x * 0.4
    blobGroup.rotation.x = mouse.y * 0.3
    ring1.rotation.z = t * 0.3
    ring2.rotation.z = -t * 0.22
    sat1.position.set(Math.cos(t * 0.8) * 3.4, Math.sin(t * 0.8) * 3.4, 0)
    sat2.position.set(Math.cos(-t * 0.6) * 3.9, Math.sin(-t * 0.6) * 3.9, 0)

    floaters.forEach((m) => {
      m.rotation.x += 0.004 * m.userData.speed * 3
      m.rotation.y += 0.006 * m.userData.speed * 3
      m.position.y += Math.sin(t * m.userData.speed + m.userData.off) * 0.003
    })

    stars.rotation.y = t * 0.01
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04
    camera.position.y += (mouse.y * 0.4 - scrollY * 0.002 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }
  tick()
}

/* ---------- Footer year ---------- */
function setYear() {
  const y = document.getElementById("year")
  if (y) y.textContent = new Date().getFullYear()
}
