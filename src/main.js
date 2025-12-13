import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

export default class Experience {
  constructor(options) {
    // Core properties
    this.time = 0;
    this.container = options.dom;

    // Setup
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupControls();
    this.setupLights();
    this.setupDebug();

    // Interaction
    this.setupRaycaster();
    this.setupMouse();

    // Events
    this.setupResize();
    this.mouseMove();

    // Add your objects
    this.addObjects();

    // Start animation loop
    this.tick();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010101);
  }

  setupCamera() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  setupLights() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(5, 5, 5);
    this.scene.add(this.directionalLight);
  }

  setupDebug() {
    if (window.location.hash === "#debug") {
      this.gui = new GUI();

      // Camera controls
      const cameraFolder = this.gui.addFolder("Camera");
      cameraFolder.add(this.camera.position, "z", 0, 10);

      // Light controls
      const lightFolder = this.gui.addFolder("Lights");
      lightFolder.add(this.ambientLight, "intensity", 0, 2).name("Ambient");
      lightFolder
        .add(this.directionalLight, "intensity", 0, 2)
        .name("Directional");
    }
  }

  setupRaycaster() {
    this.raycaster = new THREE.Raycaster();
  }

  setupMouse() {
    this.mouse = new THREE.Vector2();
    this.mouseNormalized = new THREE.Vector2();
  }

  mouseMove() {
    window.addEventListener("mousemove", (e) => {
      // Normalized coordinates (-1 to 1)
      this.mouse.x = (e.clientX / this.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.height) * 2 + 1;

      // Pixel coordinates
      this.mouseNormalized.x = e.clientX;
      this.mouseNormalized.y = e.clientY;

      // Raycasting
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        // Handle intersections
        // console.log("Intersected:", intersects[0].object);
      }
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addObjects() {
    // Example: Add a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.5,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Add axes helper (remove in production)
    if (window.location.hash === "#debug") {
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    }
  }

  update() {
    // Update time
    this.time += 0.01;

    // Update controls
    this.controls.update();

    // Example: Rotate cube
    if (this.cube) {
      this.cube.rotation.x = this.time;
      this.cube.rotation.y = this.time * 0.5;
    }
  }

  tick() {
    // Update
    this.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Keep looping
    requestAnimationFrame(this.tick.bind(this));
  }

  // Cleanup method for disposal
  dispose() {
    this.renderer.dispose();
    if (this.gui) this.gui.destroy();
    window.removeEventListener("resize", this.resize.bind(this));
  }
}

// Initialize
new Experience({ dom: document.getElementById("container") });
