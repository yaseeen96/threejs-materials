import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

// debug ui
const gui = new GUI();
const materialFolder = gui.addFolder("Material");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const dooralphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorheightTexture = textureLoader.load("/textures/door/height.jpg");
const doormetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doornormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorroughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matCapTexture = textureLoader.load("/textures/matcaps/3.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.png");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matCapTexture.colorSpace = THREE.SRGBColorSpace;

const basicMaterial = new THREE.MeshPhysicalMaterial({
  map: doorColorTexture,
  clearcoat: 1,
  clearcoatRoughness: 1,
  metalness: 1,
  roughness: 1,
  aoMap: doorambientOcclusionTexture,
  metalnessMap: doormetalnessTexture,
  roughnessMap: doorroughnessTexture,
  sheen: 0.5,
  sheenRoughness: 0.5,
  normalMap: doornormalTexture,
  //   displacementMap: doorheightTexture,
  aoMapIntensity: 1,
  //   alphaMap: dooralphaTexture,
  //   matcap: matCapTexture,
  side: THREE.DoubleSide,
  //   wireframe: true,
  //   flatShading: true,
  color: "#ffffff",
  //   transparent: true,
  //   opacity: 0.2,
});
// basicMaterial.color = new THREE.Color("#ff0000");

let sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  basicMaterial
);
sphereMesh.position.set(-3, 0.5, 0.5);

let torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.5, 8, 50),
  basicMaterial
);
torusMesh.position.set(3, 0, 0);

let boxMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), basicMaterial);

boxMesh.position.set(0, 0, 0);

// torusMesh.position.set(1, 0, 0);
// Scene
const scene = new THREE.Scene();
scene.add(boxMesh, sphereMesh, torusMesh);

// light
// const light = new THREE.AmbientLight(0xffffff, 1);
// scene.add(light);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// rgbe loader

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environment) => {
  environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environment;
  scene.environment = environment;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;
scene.add(camera);
// camera.lookAt(10, 2, 3);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// debug ui
materialFolder.add(basicMaterial, "metalness").min(0).max(1).step(0.001);
materialFolder.add(basicMaterial, "roughness").min(0).max(1).step(0.001);
materialFolder.add(basicMaterial, "aoMapIntensity").min(0).max(1).step(0.001);
materialFolder.add(basicMaterial, "clearcoat").min(0).max(1).step(0.001);
materialFolder.add(basicMaterial, "sheen").min(0).max(1).step(0.001);
materialFolder.add(basicMaterial, "sheenRoughness").min(0).max(1).step(0.001);
materialFolder
  .add(basicMaterial, "clearcoatRoughness")
  .min(0)
  .max(1)
  .step(0.001);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   rotate objects
  sphereMesh.rotation.y = elapsedTime * 0.1;
  torusMesh.rotation.y = elapsedTime * 0.1;
  boxMesh.rotation.y = elapsedTime * 0.1;
  sphereMesh.rotation.x = elapsedTime * -0.15;
  torusMesh.rotation.x = elapsedTime * -0.15;
  boxMesh.rotation.x = elapsedTime * -0.15;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
