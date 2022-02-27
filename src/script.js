import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'
import * as dat from 'dat.gui'

const ELECTRON_RADIUS = 0.01;
const PROTON_RADIUS = 0.2;

const ELECTRON_MATERIAL = {
        uniforms: {
            uTime: { value: 0 },
            uTimeScaleVert: { value: 0.1 },
            uNoiseScaleVert: { value: 0.8 },
            uDisplacementScale: { value: 0.006 },

            uTimeScaleFrag: { value: 0.01 },
            uNoiseScaleRed: { value: 0.0 },
            uNoiseScaleGreen: { value: 0.0 },
            uNoiseScaleBlue: { value: 0.0 }
        },
        vertexShader,
        fragmentShader
}

const PROTON_MATERIAL = {
        uniforms: {
            uTime: { value: 0 },
            uTimeScaleVert: { value: 0.01 },
            uNoiseScaleVert: { value: 1 },
            uDisplacementScale: { value: 0.06 },

            uTimeScaleFrag: { value: 0.01 },
            uNoiseScaleRed: { value: 0.0 },
            uNoiseScaleGreen: { value: 2.0 },
            uNoiseScaleBlue: { value: 2.0 }
        },
        vertexShader,
        fragmentShader
}

const createSphere = (r, res, mat, mColor) => {
    const geometry = new THREE.SphereBufferGeometry(r, res, res)
    const material = new THREE.ShaderMaterial(mat)
    material.color = new THREE.Color(mColor)
    const sphere = new THREE.Mesh(geometry, material)

    return sphere
}

const createElectron = () => {
    const electron = createSphere(
        ELECTRON_RADIUS, 
        8, 
        ELECTRON_MATERIAL,
        0xF21D1D)
    electron.position.x = 1.5
    return electron
}

const createProton = () => {
    const proton = createSphere(
        PROTON_RADIUS, 
        64, 
        PROTON_MATERIAL,
        0xf2f2f2)
    return proton
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const initWindow = () => {
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
}

const init = () => {
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    const proton1 = createProton()
    const electron1 = createElectron() 
    scene.add(proton1)
    scene.add(electron1)

    const pointLight = new THREE.PointLight(0x91AAF2, 1)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    initWindow()

    const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({ canvas: canvas })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const clock = new THREE.Clock()
    var r = 1.5;
    var theta = 0;
    var dTheta = 2 * Math.PI / 100;
    const tick = () => {

        const elapsedTime = clock.getElapsedTime()

        proton1.rotation.y = .5 * elapsedTime

        theta += dTheta
        electron1.position.x = r * Math.cos(theta); 
        electron1.position.z = r * Math.sin(theta);

        proton1.material.uniforms.uTime.value++;
        electron1.material.uniforms.uTime.value++;

        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }
    tick()
}

init()
