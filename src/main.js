import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

    // Events
    this.setupResize();

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
      1000,
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
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.5,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
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
    window.removeEventListener("resize", this.resize.bind(this));
  }
}

// Initialize
new Experience({ dom: document.getElementById("container") });
