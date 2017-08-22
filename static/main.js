
document.addEventListener("DOMContentLoaded", function(event){

	var renderer = new THREE.WebGLRenderer();  // create a renderer object

	// set the pixel ratio and size of the window
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// appending renderer DOM to the body of the page ???? (I am not sure about this)
	document.body.appendChild(renderer.domElement);

	// create an object scene
	var scene = new THREE.Scene();
	// define a camera with field_of_view = 70, ratio, near and far clipping planes
	var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 3;

	var light = new THREE.PointLight(0xffffff, 1);
	light.position.set(5, 5, 4);
	scene.add(light);

	var light1 = new THREE.PointLight(0xff0000, 1);
	light1.position.set(-5, -5, 4);
	scene.add(light1);

	var plane = new THREE.BufferGeometry();
	var vertices = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0]);
	var vertice_array = new THREE.BufferAttribute(vertices, 3);
	plane.addAttribute('position', vertice_array);



	var vertice_color = new Float32Array([0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 
		0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);
	var color_array = new THREE.BufferAttribute(vertice_color , 3);
	plane.addAttribute('color',color_array);


	var texture = new THREE.TextureLoader().load( "/static/images/cornellbox.png");
	var left_bottom = [0.0, 0.0];
	var right_bottom = [1.0, 0.0];
	var right_top = [1.0, 1.0];
	var left_top = [0.0, 1.0];
	var uv_vertices = new Float32Array([left_bottom[0], left_bottom[1], right_bottom[0], 
		right_bottom[1], right_top[0], right_top[1], right_top[0], right_top[1], left_top[0], 
		left_top[1], left_bottom[0], left_bottom[1]]);
	var uv_array = new THREE.BufferAttribute(uv_vertices, 2);
	plane.addAttribute('uv', uv_array);

//	var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.NoColors, map: texture });

	var vShader = [
		'varying vec2 vUV;',
		'void main() {',
			'vUV = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}',
	].join('\n');

	var fShader = [
		'varying vec2 vUV;',
		'uniform sampler2D texture;',
		'void main() {',
		'vec3 sum = vec3(0, 0, 0)',
		'gl_FragColor = texture2D(texture, vUV);',
		'}',
	].join('\n');

	console.log(fShader);
	var texture_loader = new THREE.TextureLoader();
	var texture = texture_loader.load("/static/images/snow.jpg");
	var material = new THREE.ShaderMaterial({ 
		uniforms: {
			texture: { type: 't', value: texture} 
		},
		vertexShader: vShader,
		fragmentShader: fShader,
		transparent: true,
	});

	window.material = material;



	var mesh = new THREE.Mesh(plane, material);
	scene.add( mesh );


	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}

	window.addEventListener('resize', onWindowResize, false);
	animate();


});

