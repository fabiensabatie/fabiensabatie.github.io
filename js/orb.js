if ( WEBGL.isWebGLAvailable() === false )
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
let container, controls, camera, scene, renderer, mixer, loader, planet,
skybox, spotLight, starfields = [], mouseX = mouseY = 0, delta = 1;
windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

function startScene() {
	init();
	getMeshes();
	animate();
}

function init() {
	/* Selecting the container */
	container = document.querySelector("#container");
	document.body.appendChild(container);
	/* Creating the scene */
	scene = new THREE.Scene();
	window.addEventListener('resize', onWindowResize, false);
	// document.addEventListener('mousemove', onDocumentMouseMove, false);
	buildRenderer();
	buildCamera();
	generateLights();
}

function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

/* We change the render size when the window is resized */
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/* Starting the animations */
function animate() {
	requestAnimationFrame(animate);
	if (mixer) mixer.update(0.01);
	if (planet) planet.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0005);
	// if (skybox) skybox.rotation.x += 0.0001;
	if (starfields) updateStarfields();

	// camera.position.x += (mouseX - camera.position.x) * 0.000001;
	// camera.position.y += (-mouseY - camera.position.y) * 0.000001;
	// if (camera.position.x >= 0.2) camera.position.x = 0.2;
	// if (camera.position.x <= -0.2) camera.position.x = -0.2;
	// if (camera.position.y >= 0.2) camera.position.y = 0.2;
	// if (camera.position.y <= -0.2) camera.position.y = -0.2;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}

function getMeshes() {
	/* Loading the container */
	loader = new THREE.GLTFLoader();
	loader.load('assets/scenes/Ninja-no-animation.gltf', (gltf) => {
		gltf.scene.rotation.z = 0.3;
		planet = gltf.scene;
		scene.add(planet);
		// buildGUI();
	});
	buildStars(8000, 0xf8f8f8f8);
	buildStars(2500, 0xd14242f8);
	buildStars(1500, 0x7ad2fff8);
}

function updateStarfields() {
	for (let s of starfields) {
		s.rotation.z += 0.0001;
		// s.rotation.x += 0.0001;
	}
}

function isWithinSphere(el, radius) {
	let dist = Math.pow(el.x, 2) + Math.pow(el.y, 2) + Math.pow(el.z, 2);
	return ((dist <= Math.pow(radius, 2)) ? true: false)
}


function buildStars(number, color) {
	//This will add a starfield to the background of a scene
	let starsGeometry = new THREE.Geometry();
	for ( var i = 0; i < number; i ++ ) {
		var star = new THREE.Vector3();
		star.x = THREE.Math.randFloatSpread(3000);
		star.y = THREE.Math.randFloatSpread(3000);
		star.z = THREE.Math.randFloatSpread(3000);
		if (isWithinSphere(star, 500)) continue;
		starsGeometry.vertices.push(star);
	}
	let starsMaterial = new THREE.PointsMaterial({color: color, size: THREE.Math.randFloat(1, 3)});
	let starfield = new THREE.Points(starsGeometry, starsMaterial);
	starfields.push(starfield);
	scene.add(starfield);
}


function buildGUI() {
	// DAT.GUI Related Stuff
	let gui = new dat.GUI({width: 400});
	let guiLight = gui.addFolder('Lights');
	let guiPlanet = gui.addFolder('Planet');
	guiLight.add(spotLight.position, 'x', -20, 20).name('Spot light - Location X').listen();
	guiLight.add(spotLight.position, 'y', -20, 20).name('Spot light - Location Y').listen();
	guiLight.add(spotLight.position, 'z', -20, 20).name('Spot light - Location Z').listen();
	guiLight.add(spotLight, 'intensity', 0, 20).name('Spot light - Intensity').listen();
	guiLight.add(spotLight, 'angle', 0, 0.1).name('Spot light - Angle').listen();
	guiLight.add(spotLight, 'distance', 0, 100).name('Spot light - Distance').listen();
	guiLight.add(spotLight, 'penumbra', 0, 1).name('Spot light - Penumbra').listen();
	guiLight.add(spotLight, 'decay', 0, 100).name('Spot light - Decay').listen();
	guiPlanet.add(planet.position, 'x', -20, 20).name('Location X').listen();
	guiPlanet.add(planet.position, 'y', -20, 20).name('Location Y').listen();
	guiPlanet.add(planet.position, 'z', -20, 20).name('Location Z').listen();
	guiPlanet.add(planet.rotation, 'x', -10, 10).name('Rotation X').listen();
	guiPlanet.add(planet.rotation, 'y', -10, 10).name('Rotation Y').listen();
	guiPlanet.add(planet.rotation, 'z', -10, 10).name('Rotation Z').listen();
	guiPlanet.add(planet.scale, 'x', 0, 6).name('Scale X').listen();
	guiPlanet.add(planet.scale, 'y', 0, 6).name('Scale Y').listen();
	guiPlanet.add(planet.scale, 'z', 0, 6).name('Scale Z').listen();
}

function generateLights() {
	/* Creating the lights and defining their position */
	spotLight = new THREE.SpotLight(0xffffffff, 13, 40, 0.048, 1, 10);
	spotLight.position.set(5, 4, 8);
	scene.add(spotLight);
}


function buildSkybox() {
	// skybox
	let cubeMaterials = [], cubeMaterial, cubeGeometry = new THREE.CubeGeometry(4096, 4096, 4096);
	for (let i = 0; i < 6; i++)
		cubeMaterials.push(new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/images/skybox.jpg'), side: THREE.DoubleSide }),)
	cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
	//add skybox & materials
	skybox = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(skybox);
}

function buildCamera() {
	/* Creating the camera and setting up controls */
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 0);
	camera.position.set(0, 0, 2);
	// controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function buildRenderer() {
	/* Setting up the render */
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor(0x000000, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaOutput = true;
	container.appendChild(renderer.domElement);
}


/* That's all folks */
startScene();
