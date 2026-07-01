/* ==========================================================================
   PHIL Dental Clinic — Three.js Hero Scene
   Renders a slowly rotating stylised 3D molar with glossy white shader,
   floating in a navy/blue particle field. Skipped on small / touch screens
   in favour of the CSS animated gradient fallback (see hero.css).
   ========================================================================== */

(function () {
  const canvas = document.getElementById('hero-canvas');
  const fallback = document.querySelector('.hero-fallback-gradient');
  if (!canvas) return;

  const isSmallScreen = window.innerWidth < 768;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isSmallScreen || isTouch || prefersReducedMotion || typeof THREE === 'undefined') {
    canvas.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    return;
  }

  let scene, camera, renderer, tooth, particles, group;
  let mouseX = 0, mouseY = 0;
  const clock = new THREE.Clock();

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1628, 0.035);

    camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 9);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    group = new THREE.Group();
    scene.add(group);

    buildTooth();
    buildParticleField();
    buildLights();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    animate();
  }

  // Build a stylised molar using a lathe geometry (rotated profile)
  function buildTooth() {
    const points = [];
    points.push(new THREE.Vector2(0.0, -1.6));
    points.push(new THREE.Vector2(0.55, -1.5));
    points.push(new THREE.Vector2(0.75, -1.1));
    points.push(new THREE.Vector2(0.65, -0.6));
    points.push(new THREE.Vector2(0.9, -0.1));
    points.push(new THREE.Vector2(1.05, 0.5));
    points.push(new THREE.Vector2(0.95, 1.0));
    points.push(new THREE.Vector2(0.6, 1.35));
    points.push(new THREE.Vector2(0.2, 1.5));
    points.push(new THREE.Vector2(0.0, 1.55));

    const latheGeo = new THREE.LatheGeometry(points, 64);
    latheGeo.computeVertexNormals();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      sheen: 1,
      sheenColor: new THREE.Color(0x00c9ff),
      envMapIntensity: 1.2,
    });

    tooth = new THREE.Mesh(latheGeo, material);
    tooth.rotation.x = Math.PI * 0.08;
    tooth.scale.setScalar(1.55);
    group.add(tooth);

    // subtle inner glow sphere behind tooth
    const glowGeo = new THREE.SphereGeometry(2.6, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00c9ff,
      transparent: true,
      opacity: 0.06,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);
  }

  function buildParticleField() {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00c9ff,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  function buildLights() {
    const ambient = new THREE.AmbientLight(0x3a5a8a, 1.1);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 6, 6);
    scene.add(key);

    const rim = new THREE.PointLight(0x00c9ff, 3.5, 20);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    const gold = new THREE.PointLight(0xc9a84c, 1.6, 15);
    gold.position.set(3, -3, -4);
    scene.add(gold);
  }

  function onResize() {
    if (!renderer || !canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (tooth) {
      tooth.rotation.y = t * 0.35;
      tooth.position.y = Math.sin(t * 0.6) * 0.15;
    }
    if (particles) {
      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.01;
    }
    if (group) {
      group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.02;
      group.rotation.x += (mouseY * 0.15 - group.rotation.x) * 0.02;
    }

    renderer.render(scene, camera);
  }

  init();
})();
