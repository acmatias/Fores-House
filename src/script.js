import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400,
})

const debugObject = {}
debugObject.fogColor = '#263740'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const fog = new THREE.Fog(debugObject.fogColor, 1, 28)
scene.fog = fog

gui.add
/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
// ss
const bakedTexture = textureLoader.load('./house/bakedHouse.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedEnvironmentTexture = textureLoader.load('./house/bakedEnvironment.jpg')
bakedEnvironmentTexture.flipY = false
bakedEnvironmentTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const bakedEnvMaterial = new THREE.MeshBasicMaterial({ map: bakedEnvironmentTexture })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/**
 * Model
 */
gltfLoader.load('./house/house.glb', (gltf) => {
    const bakedMesh = gltf.scene.children.find((child) => child.name === 'bakedModel')
    const bakedEnvMesh = gltf.scene.children.find((child) => child.name === 'bakedEnv')
    const windowMesh = gltf.scene.children.find((child) => child.name === 'window')
    const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
    const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

    bakedMesh.material = bakedMaterial
    bakedEnvMesh.material = bakedEnvMaterial
    windowMesh.material = poleLightMaterial
    poleLightAMesh.material = poleLightMaterial
    poleLightBMesh.material = poleLightMaterial

    scene.add(gltf.scene)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -10
camera.position.y = 5
camera.position.z = 10
camera.focus = 100
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false
controls.minPolarAngle = 1
controls.maxPolarAngle = 1.5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setClearColor(debugObject.fogColor)

gui.addColor(debugObject, 'fogColor').onChange(() => {
    renderer.setClearColor(debugObject.fogColor)
    fog.color.set(debugObject.fogColor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
