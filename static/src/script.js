import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
// import GUI from 'lil-gui'

/** * Loaders */
let sceneReady = false
const loadingBarElement = document.querySelector('.loading-bar')
const footerElement = document.querySelector('footer')
// const fileNameElement = document.getElementById('file-name')
// const progressBarElement = document.getElementById('progress-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        window.setTimeout(() => {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
            // show footer
            footerElement.classList.remove('hidden')
        }, 500)
        window.setTimeout(() => { sceneReady = true }, 1000)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        console.log(`Loading item: ${itemUrl}`);
        console.log(`Items loaded: ${itemsLoaded} of ${itemsTotal}`)
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

const gltfLoader = new GLTFLoader(loadingManager) 

const textureLoader = new THREE.TextureLoader(loadingManager)
const bakedTexture = textureLoader.load('models/backed_texture.webp')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

/** * Base */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x222222 )

/** * Overlay */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


/** * Models */
const modelsRotation = Math.PI * 0.5

const loadModel = (url, scale, rotation, position = null) => {
    gltfLoader.load(url, (gltf) => {
        const model = gltf.scene;  model.scale.set(scale, scale, scale); model.rotation.y = rotation;
        if (position) model.position.set(...position);
        model.traverse((child) => {
            if (child.isMesh) { child.material.map = bakedTexture; child.frustumCulled = true; }
        }); scene.add(model); });
}

const models = [
    { url: '/models/base-static.gltf', scale: 0.2, rotation: modelsRotation },
    { url: '/models/bigRobot.gltf', scale: 0.2, rotation: modelsRotation },
    { url: '/models/door.gltf', scale: 0.2, rotation: modelsRotation },
    { url: '/models/door.gltf', scale: 0.2, rotation: 0, position: [0.88, 1.967, -5.95] },
    { url: '/models/ac.gltf', scale: 0.2, rotation: modelsRotation },
    { url: '/models/ac.gltf', scale: 0.2, rotation: 0, position: [0.88, 0, -4.97] },
    { url: '/models/shelves.gltf', scale: 0.2, rotation: modelsRotation },
    { url: '/models/shelves.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -1.34] },
    { url: '/models/shelves.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -2.61] },
    { url: '/models/shelves.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -3.78] },
    { url: '/models/shelves.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -4.977] },
    { url: '/models/shelves.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -6.14] },
    { url: '/models/workstation.gltf', scale: 0.2, rotation: modelsRotation },
    { url: '/models/workstation.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -1.7] },
    { url: '/models/workstation.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -3.475] },
    { url: '/models/workstation.gltf', scale: 0.2, rotation: modelsRotation, position: [0, 0, -5.42] }
]

models.forEach(model => loadModel(model.url, model.scale, model.rotation, model.position))


gltfLoader.load('/models/window.gltf', (gltf) => {
        const windowModel = gltf.scene
        windowModel.scale.set(0.2, 0.2, 0.2); 
        windowModel.traverse((child) => { if (child.isMesh) { child.material.map = bakedTexture, child.frustumCulled = true }})

        const windowInstances = [
        { position: new THREE.Vector3(0, 0, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(0, -0.335, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(0, -0.796, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(0, -1.148, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(-0.54, -0.174, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(-0.54, -0.528, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(-0.54, -0.99, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(-0.54, -1.326, 0), rotation: new THREE.Euler(0, modelsRotation, 0) },
        { position: new THREE.Vector3(0.88, 0, -1.161), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.33, -1.161), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.136, -1.695), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.478, -1.695), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, 0.029, -2.81), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.303, -2.81), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.14, -3.363), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.475, -3.363), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, 0.05, -4.465), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.303, -4.465), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.135, -5.005), rotation: new THREE.Euler(0, 0, 0) },
        { position: new THREE.Vector3(0.88, -0.48, -5.005), rotation: new THREE.Euler(0, 0, 0) },
        ]
        
        for (const instance of windowInstances){
            const winInstance = windowModel.clone()
            winInstance.position.copy(instance.position)
            winInstance.rotation.copy(instance.rotation)
            scene.add(winInstance)
        }
    }

)
gltfLoader.load('/models/projector.gltf', (gltf) => {
        const nRow = 8; const nColumn = 3; const xSpace = 2; const zSpace = 0.9;
        for (let row = 0; row < nRow; row++) {
            for (let col = 0; col < nColumn; col++) {
                const projectors = gltf.scene.clone()
                projectors.scale.set(0.2, 0.2, 0.2); projectors.rotation.y = modelsRotation;
                projectors.position.set([col * xSpace], 0, -[row * zSpace])
                scene.add(projectors)
                projectors.traverse((child) => { if (child.isMesh) { child.material.map = bakedTexture, child.frustumCulled = true }})
            }
        }
    }
)
// with animation inside gltf
gltfLoader.load('/models/miniRobot.gltf', (gltf) => {
        const mini1 = gltf.scene; mini1.scale.set(0.2, 0.2, 0.2); mini1.position.set(0, 0, 0); mini1.rotation.y = Math.PI / 2;  scene.add(mini1);
        mini1.traverse((child) => { if (child.isMesh) { child.material.map = bakedTexture, child.frustumCulled = true }});

        const mini2 = mini1.clone(); mini2.position.set(-2.89, -1.485, 1.389); mini2.rotation.y = 2.771; scene.add(mini2);

        const mini3 = mini1.clone(); mini3.position.set(0.85, -1.248, 2.273); mini3.rotation.y = - 1.931; scene.add(mini3);

        const mini4 = mini1.clone(); mini4.position.set(0.458, -1.146, 6.596); mini4.rotation.set(0.346, - 1.931, 0.456); scene.add(mini4);

        const mini2Motion = gltf.animations
        if (mini2Motion && mini2Motion.length > 0) {
            const mixer = new THREE.AnimationMixer(mini2)
            const action = mixer.clipAction(mini2Motion[0])
            action.play()
            const clock = new THREE.Clock()
            const animate = () => {
                const deltaTime = clock.getDelta()
                mixer.update(deltaTime)
                renderer.render(scene, camera)
                requestAnimationFrame(animate)
            }
            animate()
        }
    }
)
gltfLoader.load('/models/miniRobotFly.gltf', (gltf) => {
        const miniFly1 = gltf.scene; miniFly1.scale.set(0.2, 0.2, 0.2); miniFly1.position.set(0, 0, 0); miniFly1.rotation.y = Math.PI / 2; scene.add(miniFly1);
        miniFly1.traverse((child) => { if (child.isMesh) { child.material.map = bakedTexture, child.frustumCulled = true }});
        const miniFly2 = miniFly1.clone(); miniFly2.position.set(0.231, -0.466, - 4.078); miniFly2.rotation.y = 1.271; scene.add(miniFly2);
        const miniFly3 = miniFly1.clone(); miniFly3.position.set(-2.043, 1.111, 2.987); miniFly3.rotation.y = 3.042; scene.add(miniFly3);
        const miniFly4 = miniFly1.clone(); miniFly4.position.set(-1.39, 1.979, -2.983); miniFly4.rotation.set(0.239, 1.361, 0.3); scene.add(miniFly4);

        const mixers = []; const clock = new THREE.Clock();

        const addAnimation = (model, animation, timeScale = 1) => {
        const mixer = new THREE.AnimationMixer(model)
        const action = mixer.clipAction(animation)
        action.setEffectiveTimeScale(timeScale)
        action.play()
        mixers.push(mixer)
    }

    const animations = gltf.animations;
    if (animations && animations.length > 0) {
        addAnimation(miniFly1, animations[0], 1.3)
        addAnimation(miniFly2, animations[1])
        addAnimation(miniFly3, animations[1], 0.7)
        addAnimation(miniFly4, animations[1], -1)
    }

    const animate = () => {
        const deltaTime = clock.getDelta()
        mixers.forEach((mixer) => mixer.update(deltaTime))
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    animate()
})
gltfLoader.load('/models/fan.gltf', (gltf) => {
        const fan = gltf.scene; fan.scale.set(0.2, 0.2, 0.2); fan.position.set(0, 0, 0); fan.rotation.y = Math.PI / 2;  scene.add(fan);
        fan.traverse((child) => { if (child.isMesh) { child.material.map = bakedTexture, child.frustumCulled = true }});

        const fanMotion = gltf.animations
        if (fanMotion && fanMotion.length > 0) {
            const mixer = new THREE.AnimationMixer(fan)
            const action = mixer.clipAction(fanMotion[0])
            action.setEffectiveTimeScale(2)
            action.play()
            const clock = new THREE.Clock()
            const animate = () => {
                const deltaTime = clock.getDelta()
                mixer.update(deltaTime)
                renderer.render(scene, camera)
                requestAnimationFrame(animate)
            }
            animate()
        }
    }
)
gltfLoader.load('/models/particle.gltf', (gltf) =>  {
    const particle = gltf.scene; 
    particle.position.set(-0.7, -0.175, 1.2); particle.rotation.y = modelsRotation; particle.scale.set(0.3, 0.3, 0.3);
    const particle2 = particle.clone(); particle2.rotation.y = -0.5; particle2.position.set(-0.5, -0.1, -5.9); 
    const particle3 = particle2.clone(); particle3.position.set(0.381, 0.054, - 3.09); particle3.scale.set(0.2, 0.2, 0.2); 
    const particle4 = particle.clone(); const particle5 = particle2.clone(); particle4.position.set(-0.486, 0.218, 4.869); particle5.position.set(-0.374, 0.198, -2.18)
    const particle6 = particle.clone(); const particle7 = particle2.clone(); particle6.position.set(-2.141, 1.379, 2.338); particle7.position.set(-2.054, 1.358, -4.741);
    const particle8 = particle3.clone(); particle8.position.set(-1.219, 1.156, 0.81); 

    scene.add(particle, pLight2, particle3, particle4, particle5, particle6, particle7, particle8);
    // scene.add(particle6, particle7);

    const mixers = []; const clock = new THREE.Clock();

    const addAnimation = (model, animation, timeScale = 1) => { 
        const mixer = new THREE.AnimationMixer(model); const action = mixer.clipAction(animation); 
        action.setEffectiveTimeScale(timeScale); action.play(); mixers.push(mixer);
    }

    const animations = gltf.animations;
    if (animations && animations.length > 0) {
        addAnimation(particle, animations[0], 1);
        addAnimation(particle2, animations[0], 1.5);
        addAnimation(particle3, animations[0], 0.8);
        addAnimation(particle4, animations[0], 1);
        addAnimation(particle5, animations[0], 1.5);
        addAnimation(particle6, animations[0], 1);
        addAnimation(particle7, animations[0], 1.5);
        addAnimation(particle8, animations[0], 0.8);
    }
    const animate = () => {
        const deltaTime = clock.getDelta();
        mixers.forEach(mixer => mixer.update(deltaTime));
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }; animate();
})
// Boxes on shelves
const shape1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), new THREE.MeshBasicMaterial());
shape1.position.set(-3.11, 0.57, 3.3); const shape2 = shape1.clone(); const shape3 = shape1.clone(); const shape4 = shape1.clone();
shape2.position.set(-3.11, 0.61, 2.1); shape3.position.set(-3.11, 0.61, -1.8); shape4.position.set(-3.11, 0.57, -3);
shape2.scale.set(0.9, 1.5, 0.7); shape3.scale.set(0.3, 1.5, 0.7); shape3.rotation.y = - Math.PI / 8; shape4.scale.set(1.3, 1, 0.4);
scene.add(shape1, shape2, shape3, shape4);

/** Points of interest */
const raycaster = new THREE.Raycaster()
const points = [
    {
        position: new THREE.Vector3(-3.219, 3.1, -2.958),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(2.996, 1.15, 4.117),
        element: document.querySelector('.point-1')
    },
]

/** Grids */
const gridHelper = new THREE.GridHelper(20, 20, 0xd0d0d0, 0x404284);
const gridDivideer = new THREE.GridHelper(20, 300, 0x454589, 0x505050)
gridDivideer.position.y = - 0.002
scene.add(gridHelper, gridDivideer)

/*** Lights */
const pLight1 = new THREE.PointLight('#ffffff', 50)
const pLight2 = pLight1.clone(); const pLight3 = pLight1.clone(); pLight3.intensity = 10;
pLight1.position.set(3.8, 2.4, 2.7); pLight2.position.set(2.5, 3.8, - 4.2); pLight3.position.set(-2.2, 1.1, 0.4);
scene.add(pLight1, pLight2, pLight3)

/** * Sizes */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

// Base camera
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100)
camera.position.set(6, sizes.width / sizes.height, - 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.autoRotate = true; controls.minDistance = 2; controls.maxDistance = 11; 
controls.maxPolarAngle = Math.PI / 2.2; controls.minPolarAngle = Math.PI / 3.2;
controls.minAzimuthAngle =  Math.PI / 2.5; controls.maxAzimuthAngle = Math.PI ;
controls.enableDamping = true; 
controls.addEventListener('change', () => {
    if (controls.getAzimuthalAngle() <= controls.minAzimuthAngle || controls.getAzimuthalAngle() >= controls.maxAzimuthAngle) {
        controls.autoRotateSpeed *= - 0.2 // Change the direction of rotation
    }
})

/** Renderer */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.useLegacyLights = false
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = false
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x202020)

/** * Animate */
const tick = () =>
{
    // Update controls
    controls.update()

    if(sceneReady)
    {
        // Go through each point
        for(const point of points)
        {
            const screenPosition = point.position.clone()
            screenPosition.project(camera)

            raycaster.setFromCamera(screenPosition, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)
        
            if(intersects.length === 0)
            { 
                point.element.classList.add('visible') 
            }
            else
            {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(camera.position)

                if(intersectionDistance < pointDistance)
                {
                    point.element.classList.remove('visible')
                }
                else
                {
                    point.element.classList.add('visible')
                }
            }

            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = - screenPosition.y * sizes.height * 0.5
            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

    // const guiSet = new GUI().title('pos')
    // guiSet.add(newObject.position, 'x', -10, 10, 0.001)
    // guiSet.add(newObject.position, 'y', -10, 10, 0.001)
    // guiSet.add(newObject.position, 'z', -10, 10, 0.001)
    // guiSet.add(newObject.rotation, 'x', - Math.PI, Math.PI, 0.001)
    // guiSet.add(newObject.rotation, 'y', - Math.PI, Math.PI, 0.001)
    // guiSet.add(newObject.rotation, 'z', - Math.PI, Math.PI, 0.001)