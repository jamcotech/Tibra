import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, RefreshCw, Sparkles, Eye } from 'lucide-react';

interface ThreeBottleSceneProps {
  scrollProgress?: number;
  className?: string;
  onInteractiveChange?: (isInteractive: boolean) => void;
}

export const ThreeBottleScene: React.FC<ThreeBottleSceneProps> = ({
  className = '',
  onInteractiveChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  // References to keep animation loop clean
  const stateRef = useRef({
    isInteractive: false,
    targetRotationY: 0,
    currentRotationY: 0,
    targetRotationX: 0,
    currentRotationX: 0,
    targetPosY: 0,
    currentPosY: 0,
    mouseNormX: 0,
    mouseNormY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    scrollYProgress: 0,
    animFrameId: 0,
  });

  useEffect(() => {
    stateRef.current.isInteractive = isInteractive;
    if (onInteractiveChange) {
      onInteractiveChange(isInteractive);
    }
  }, [isInteractive, onInteractiveChange]);

  useEffect(() => {
    // Check WebGL availability
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch {
      setWebGLSupported(false);
      return;
    }
    if (!gl) {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // SCENE SETUP
    const scene = new THREE.Scene();

    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.2);

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff5e8, 1.2);
    scene.add(ambientLight);

    // Key Light (Warm Golden highlight)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.8);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (Soft Botanical Green)
    const fillLight = new THREE.DirectionalLight(0xd9ecd8, 1.4);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Rim/Back Light (Golden rim accent on bottle curves)
    const rimLight = new THREE.DirectionalLight(0xffd57e, 3.2);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Bottom bounce light
    const bounceLight = new THREE.DirectionalLight(0xecd8be, 0.8);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // ROOT BOTTLE GROUP
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(0, -0.3, 0);
    scene.add(bottleGroup);

    // 1. AMBER GLASS BOTTLE BODY
    // Realistic amber glass lathe profile
    const points: THREE.Vector2[] = [];
    // Base curvature
    points.push(new THREE.Vector2(0, -1.5));
    points.push(new THREE.Vector2(0.9, -1.5));
    points.push(new THREE.Vector2(1.0, -1.45));
    points.push(new THREE.Vector2(1.05, -1.35));
    // Main cylindrical body
    points.push(new THREE.Vector2(1.05, 0.3));
    // Shoulder curve
    points.push(new THREE.Vector2(1.02, 0.55));
    points.push(new THREE.Vector2(0.9, 0.8));
    points.push(new THREE.Vector2(0.65, 1.05));
    points.push(new THREE.Vector2(0.48, 1.18));
    // Neck
    points.push(new THREE.Vector2(0.48, 1.45));
    // Lip ring
    points.push(new THREE.Vector2(0.53, 1.47));
    points.push(new THREE.Vector2(0.53, 1.55));
    points.push(new THREE.Vector2(0.45, 1.56));
    points.push(new THREE.Vector2(0.38, 1.55));
    points.push(new THREE.Vector2(0.38, 1.4));

    const bottleGeo = new THREE.LatheGeometry(points, 64);
    const amberGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#783811'),
      emissive: new THREE.Color('#291002'),
      emissiveIntensity: 0.15,
      roughness: 0.14,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.94,
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, amberGlassMaterial);
    bottleMesh.castShadow = true;
    bottleMesh.receiveShadow = true;
    bottleGroup.add(bottleMesh);

    // 2. INNER LIQUID VOLUME
    const liquidPoints: THREE.Vector2[] = [];
    liquidPoints.push(new THREE.Vector2(0, -1.42));
    liquidPoints.push(new THREE.Vector2(0.96, -1.42));
    liquidPoints.push(new THREE.Vector2(0.98, 0.25));
    liquidPoints.push(new THREE.Vector2(0.85, 0.7));
    liquidPoints.push(new THREE.Vector2(0, 0.7));
    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 48);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d47b19'),
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.82,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
    bottleGroup.add(liquidMesh);

    // 3. INTERNAL GLASS DROPPER PIPETTE
    const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.1, 16);
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      roughness: 0.1,
      ior: 1.48,
      transparent: true,
      opacity: 0.7,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.position.set(0, -0.2, 0);
    bottleGroup.add(tubeMesh);

    // 4. METALLIC GOLD DROPPER COLLAR / CAP
    const goldCapGroup = new THREE.Group();
    goldCapGroup.position.set(0, 1.42, 0);

    // Main golden sleeve
    const capGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.82, 48);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.5,
    });
    const capMesh = new THREE.Mesh(capGeo, goldMaterial);
    capMesh.position.set(0, 0.41, 0);
    capMesh.castShadow = true;
    goldCapGroup.add(capMesh);

    // Decorative ribbed gold ring
    const ringGeo = new THREE.TorusGeometry(0.53, 0.025, 16, 48);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh1 = new THREE.Mesh(ringGeo, goldMaterial);
    ringMesh1.position.set(0, 0.12, 0);
    goldCapGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, goldMaterial);
    ringMesh2.position.set(0, 0.72, 0);
    goldCapGroup.add(ringMesh2);

    // 5. WHITE SILICONE RUBBER BULB (Dropper top)
    const bulbPoints: THREE.Vector2[] = [];
    bulbPoints.push(new THREE.Vector2(0.42, 0.82));
    bulbPoints.push(new THREE.Vector2(0.44, 0.95));
    bulbPoints.push(new THREE.Vector2(0.38, 1.25));
    bulbPoints.push(new THREE.Vector2(0.28, 1.55));
    bulbPoints.push(new THREE.Vector2(0.18, 1.72));
    bulbPoints.push(new THREE.Vector2(0, 1.78));

    const bulbGeo = new THREE.LatheGeometry(bulbPoints, 48);
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbfbfa,
      roughness: 0.45,
      metalness: 0.02,
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMaterial);
    goldCapGroup.add(bulbMesh);

    bottleGroup.add(goldCapGroup);

    // 6. BOTTLE LABEL
    // Cylindrical label wrapping the bottle front
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/bottle-label-texture.png',
      (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const labelGeo = new THREE.CylinderGeometry(
          1.055, // slightly larger radius to sit over glass
          1.055,
          1.48,  // height
          64,
          1,
          true,
          -Math.PI * 0.42, // start angle
          Math.PI * 0.84   // sweep angle (covers ~300 degrees front face)
        );

        const labelMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.99,
          side: THREE.DoubleSide,
        });

        const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
        labelMesh.position.set(0, -0.48, 0);
        // Face forward
        labelMesh.rotation.y = -Math.PI / 2;
        bottleGroup.add(labelMesh);
        setLoading(false);
      },
      undefined,
      () => {
        // Fallback if texture fails: clean botanical badge
        const labelGeo = new THREE.CylinderGeometry(1.055, 1.055, 1.48, 48, 1, true, -Math.PI * 0.4, Math.PI * 0.8);
        const labelMaterial = new THREE.MeshStandardMaterial({
          color: 0xfdfbf7,
          roughness: 0.35,
          side: THREE.DoubleSide,
        });
        const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
        labelMesh.position.set(0, -0.48, 0);
        bottleGroup.add(labelMesh);
        setLoading(false);
      }
    );

    // 7. SOFT GROUND CONTACT SHADOW
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    // Radial shadow gradient canvas texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, 'rgba(15, 30, 18, 0.48)');
    grad.addColorStop(0.35, 'rgba(15, 30, 18, 0.22)');
    grad.addColorStop(0.7, 'rgba(15, 30, 18, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.51, 0);
    bottleGroup.add(shadowMesh);

    // 8. 3D FLOATING BOTANICAL LEAVES
    const leavesGroup = new THREE.Group();
    scene.add(leavesGroup);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.2, 0.3, 0.25, 0.7, 0, 1.1);
    leafShape.bezierCurveTo(-0.25, 0.7, -0.2, 0.3, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x748c48,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const leafData: {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      speed: number;
      rotSpeed: THREE.Vector3;
      phase: number;
    }[] = [];

    const leafConfigs = [
      { pos: new THREE.Vector3(-2.2, 1.4, 0.8), scale: 0.48, rot: [0.3, 0.4, 0.6] },
      { pos: new THREE.Vector3(2.4, 1.0, 0.5), scale: 0.55, rot: [-0.2, -0.6, -0.4] },
      { pos: new THREE.Vector3(-1.9, -0.8, 1.2), scale: 0.42, rot: [0.5, -0.3, 0.8] },
      { pos: new THREE.Vector3(2.1, -1.2, 0.9), scale: 0.45, rot: [-0.4, 0.5, -0.5] },
      { pos: new THREE.Vector3(0.3, 2.3, -0.8), scale: 0.38, rot: [0.1, 0.8, 0.2] },
    ];

    leafConfigs.forEach((cfg, idx) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.copy(cfg.pos);
      leaf.scale.set(cfg.scale, cfg.scale, cfg.scale);
      leaf.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      leavesGroup.add(leaf);
      leafData.push({
        mesh: leaf,
        basePos: cfg.pos.clone(),
        speed: 0.8 + idx * 0.2,
        rotSpeed: new THREE.Vector3(0.005, 0.008, 0.004),
        phase: idx * 1.3,
      });
    });

    // 9. FLOATING GOLDEN AMBER MICRO-PARTICLES
    const particleCount = 28;
    const particleGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffcb45,
      emissive: 0xd48817,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });

    const particles: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; phase: number }[] = [];
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const radius = 1.6 + Math.random() * 1.8;
      const angle = (i / particleCount) * Math.PI * 2;
      const py = (Math.random() - 0.5) * 3.5;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      p.position.set(px, py, pz);
      const s = 0.5 + Math.random() * 0.8;
      p.scale.set(s, s, s);
      particleGroup.add(p);
      particles.push({
        mesh: p,
        basePos: p.position.clone(),
        speed: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // SCROLL LISTENER
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      stateRef.current.scrollYProgress = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // MOUSE PARALLAX & INTERACTIVE DRAG
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseNormX = x;
      stateRef.current.mouseNormY = y;

      if (stateRef.current.isInteractive && stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.lastMouseX;
        const deltaY = e.clientY - stateRef.current.lastMouseY;
        stateRef.current.targetRotationY += deltaX * 0.012;
        stateRef.current.targetRotationX += deltaY * 0.008;
        // Clamp pitch
        stateRef.current.targetRotationX = Math.max(-0.4, Math.min(0.4, stateRef.current.targetRotationX));
        stateRef.current.lastMouseX = e.clientX;
        stateRef.current.lastMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!stateRef.current.isInteractive) return;
      stateRef.current.isDragging = true;
      stateRef.current.lastMouseX = e.clientX;
      stateRef.current.lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    // TOUCH SUPPORT FOR MOBILE
    const handleTouchStart = (e: TouchEvent) => {
      if (!stateRef.current.isInteractive || e.touches.length === 0) return;
      stateRef.current.isDragging = true;
      stateRef.current.lastMouseX = e.touches[0].clientX;
      stateRef.current.lastMouseY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.isInteractive || !stateRef.current.isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - stateRef.current.lastMouseX;
      const deltaY = e.touches[0].clientY - stateRef.current.lastMouseY;
      stateRef.current.targetRotationY += deltaX * 0.012;
      stateRef.current.targetRotationX += deltaY * 0.008;
      stateRef.current.targetRotationX = Math.max(-0.4, Math.min(0.4, stateRef.current.targetRotationX));
      stateRef.current.lastMouseX = e.touches[0].clientX;
      stateRef.current.lastMouseY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // INTERSECTION OBSERVER TO PAUSE WHEN OFF-SCREEN
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      stateRef.current.animFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      clock.getDelta();
      const time = clock.getElapsedTime();
      const st = stateRef.current;

      if (st.isInteractive) {
        // Free Orbit Mode: smooth dampening to target rotation
        st.currentRotationY += (st.targetRotationY - st.currentRotationY) * 0.1;
        st.currentRotationX += (st.targetRotationX - st.currentRotationX) * 0.1;
        bottleGroup.rotation.y = st.currentRotationY;
        bottleGroup.rotation.x = st.currentRotationX;
        bottleGroup.position.y = -0.3 + Math.sin(time * 1.5) * 0.03;
      } else {
        // Scroll-Driven Storytelling Mode:
        // Section progress dictates bottle rotation and gentle breathing
        const scrollP = st.scrollYProgress;

        // Base rotation linked to scroll (gradually rotates to reveal all facets of the bottle)
        const scrollTargetY = scrollP * Math.PI * 3.2;
        // Subtle mouse tilt parallax
        const mouseTiltX = st.mouseNormY * 0.15;
        const mouseTiltY = st.mouseNormX * 0.25;

        // Gentle breathing float
        const breathY = Math.sin(time * 1.8) * 0.04;
        const breathRotZ = Math.sin(time * 1.2) * 0.02;

        st.currentRotationY += (scrollTargetY + mouseTiltY - st.currentRotationY) * 0.06;
        st.currentRotationX += (mouseTiltX - st.currentRotationX) * 0.06;

        bottleGroup.rotation.y = st.currentRotationY;
        bottleGroup.rotation.x = st.currentRotationX;
        bottleGroup.rotation.z = breathRotZ;
        bottleGroup.position.y = -0.3 + breathY;
      }

      // Animate floating botanical leaves
      leafData.forEach((leaf) => {
        const floatY = Math.sin(time * leaf.speed + leaf.phase) * 0.12;
        const floatX = Math.cos(time * (leaf.speed * 0.7) + leaf.phase) * 0.08;
        leaf.mesh.position.y = leaf.basePos.y + floatY;
        leaf.mesh.position.x = leaf.basePos.x + floatX;
        leaf.mesh.rotation.y += leaf.rotSpeed.y;
        leaf.mesh.rotation.z += Math.sin(time + leaf.phase) * 0.005;
      });

      // Animate floating golden micro-particles
      particles.forEach((p) => {
        p.mesh.position.y = p.basePos.y + Math.sin(time * p.speed + p.phase) * 0.18;
        p.mesh.position.x = p.basePos.x + Math.cos(time * 0.5 + p.phase) * 0.06;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(stateRef.current.animFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      observer.disconnect();

      // Clean up Three.js resources
      bottleGeo.dispose();
      amberGlassMaterial.dispose();
      liquidGeo.dispose();
      liquidMaterial.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      capGeo.dispose();
      goldMaterial.dispose();
      bulbGeo.dispose();
      bulbMaterial.dispose();
      leafGeo.dispose();
      leafMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  const resetOrientation = () => {
    stateRef.current.targetRotationY = 0;
    stateRef.current.targetRotationX = 0;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${className}`}
      style={{ touchAction: isInteractive ? 'none' : 'auto' }}
    >
      {/* Three.js WebGL Canvas */}
      {webGLSupported ? (
        <canvas
          ref={canvasRef}
          className={`w-full h-full block ${isInteractive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        />
      ) : (
        /* Graceful Fallback: High-res cutout with 2.5D tilt */
        <div className="w-full h-full flex items-center justify-center relative p-8">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-botanical-500/20 to-gold/20 rounded-full blur-2xl opacity-60" />
            <img
              src="/assets/purefix-bottle-transparent.webp"
              alt="TIBRA NATURALS Pain Relief Oil 30 ML Bottle"
              width={360}
              height={520}
              loading="lazy"
              className="max-h-[520px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(20,56,35,0.25)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {loading && webGLSupported && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[#FAF8F5]/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-botanical-200/50 shadow-sm text-xs font-medium text-botanical-800">
            <span className="w-2 h-2 rounded-full bg-botanical-500 animate-ping" />
            Initializing 3D Amber Glass Scene...
          </div>
        </div>
      )}

      {/* Floating 3D Controls Pill */}
      {webGLSupported && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-white/85 backdrop-blur-md border border-cream-200 shadow-luxury transition-all duration-300">
          <button
            type="button"
            onClick={() => setIsInteractive(!isInteractive)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isInteractive
                ? 'bg-botanical-800 text-cream-50 shadow-sm'
                : 'bg-cream-100 text-botanical-900 hover:bg-cream-200'
            }`}
            title={isInteractive ? 'Switch to Scroll Story Mode' : 'Inspect 3D Bottle (Click & Drag)'}
          >
            {isInteractive ? (
              <>
                <Rotate3d className="w-3.5 h-3.5 text-gold-light animate-spin" style={{ animationDuration: '6s' }} />
                <span>360° Free Inspect Active</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-botanical-600" />
                <span>Inspect in 3D</span>
              </>
            )}
          </button>

          {isInteractive && (
            <button
              type="button"
              onClick={resetOrientation}
              className="p-1.5 rounded-full text-botanical-700 hover:text-botanical-950 hover:bg-cream-200 transition-colors"
              title="Reset 3D Orientation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 pr-2 text-[10px] text-botanical-600/80 font-mono border-l border-cream-300 pl-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>WebGL 3D Refraction</span>
          </div>
        </div>
      )}
    </div>
  );
};
