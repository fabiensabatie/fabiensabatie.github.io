if ( WEBGL.isWebGLAvailable() === false )
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
let orb, controls, camera, scene, renderer, mixer, loader;

function init() {

	/* Selecting the container */
	orb = document.querySelector("#orb");
	document.body.appendChild(orb);

	/* Setting up the render */
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

	renderer.setClearColor(0x000000, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaOutput = true;
	orb.appendChild(renderer.domElement);


	/* Creating the camera and setting up controls */
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 0, 30);
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	/* Creating the scene */
	scene = new THREE.Scene();

	/* Creating the lights and defining their position */
	let spotLight = new THREE.SpotLight(0xffffffff, 1, 40, 1, 1, 10);
	let ambLight = new THREE.AmbientLight(0xffffffff, 0.1);
	// SpotLight(color, intensity, distance, angle, penumbra, decay)
	spotLight.position.set(5, 5, 5);
	// let spotLightHelper = new THREE.SpotLightHelper(spotLight);
	// scene.add(spotLightHelper);
	scene.add(spotLight);
	scene.add(ambLight);
	// DAT.GUI Related Stuff

	let gui = new dat.GUI({width: 400});
	let guiLight = gui.addFolder('Lights');
	guiLight.add(spotLight.position, 'x', -20, 20).name('Spot light - Location X').listen();
	guiLight.add(spotLight.position, 'y', -20, 20).name('Spot light - Location Y').listen();
	guiLight.add(spotLight.position, 'z', -20, 20).name('Spot light - Location Z').listen();
	guiLight.add(spotLight, 'intensity', 0, 20).name('Spot light - Intensity').listen();
	guiLight.add(spotLight, 'distance', 0, 100).name('Spot light - Distance').listen();
	guiLight.add(spotLight, 'penumbra', 0, 1).name('Spot light - Penumbra').listen();
	guiLight.add(spotLight, 'decay', 0, 100).name('Spot light - Decay').listen();
	guiLight.add(ambLight, 'intensity', 0, 20).name('Ambient light - Intensity').listen();


	/* Resizing the window */
	window.addEventListener('resize', onWindowResize, false);

	/* Loading the orb */
	loader = new THREE.GLTFLoader();
	loader.load('assets/scenes/JupiterLarge.gltf', (gltf) => {
		gltf.scene.rotation.z = 1.6;
		// create a glowMesh
		scene.add(gltf.scene);
		let guiPlanet = gui.addFolder('Planet');
		guiPlanet.add(gltf.scene.position, 'x', -20, 20).name('Location X').listen();
		guiPlanet.add(gltf.scene.position, 'y', -20, 20).name('Location Y').listen();
		guiPlanet.add(gltf.scene.position, 'z', -20, 20).name('Location Z').listen();
		guiPlanet.add(gltf.scene.rotation, 'x', 0, 6).name('Rotation X').listen();
		guiPlanet.add(gltf.scene.rotation, 'y', 0, 6).name('Rotation Y').listen();
		guiPlanet.add(gltf.scene.rotation, 'z', 0, 6).name('Rotation Z').listen();
		guiPlanet.add(gltf.scene.scale, 'x', 0, 6).name('Scale X').listen();
		guiPlanet.add(gltf.scene.scale, 'y', 0, 6).name('Scale Y').listen();
		guiPlanet.add(gltf.scene.scale, 'z', 0, 6).name('Scale Z').listen();
	});
}

/* We change the render size when the window is resized */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/* Starting the animations */
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (mixer) mixer.update(0.01);
}

/* That's all folks */
init();
animate();
