
document.addEventListener("DOMContentLoaded", function(event){

	var renderer = new THREE.WebGLRenderer();  // create a renderer object

	// set the pixel ratio and size of the window
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// appending renderer DOM to the body of the page (domElement is the canvas)
	document.body.appendChild(renderer.domElement);

	// create an object scene
	var scene = new THREE.Scene();
	// define a camera with field_of_view = 70, ratio, near and far clipping planes
	// this camera is a perspective camera (I might need to switch to orthographic camera)
	var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 3;

	// adding light source to the scene
	var light1 = new THREE.PointLight(0xffffff, 1);
	light1.position.set(5, 5, 4);
	scene.add(light1);

	var light2 = new THREE.PointLight(0xff0000, 1);
	light2.position.set(-5, -5, 4);
	scene.add(light2);

	// bufferGeometry stores all data including vertices within buffers
	// plane consists of two triangles
	var plane = new THREE.BufferGeometry();
	var vertices = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0]);
	var vertice_array = new THREE.BufferAttribute(vertices, 3);
	plane.addAttribute('position', vertice_array);



	var vertice_color = new Float32Array([0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 
		0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);
	var color_array = new THREE.BufferAttribute(vertice_color , 3);
	plane.addAttribute('color',color_array);

	// loading texture
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
	
	// vertex shader variable
	var vShader = [
		'varying vec2 vUV;',
		'void main() {',
			'vUV = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}',
	].join('\n');
	
	// fragment shader variable
	var fShader = [
		'varying vec2 vUV;',
		'uniform sampler2D texture;',
		'uniform vec2 dimension;',
		'void main() {',
		'float pixel_width = 1.0/dimension[0];',
		'float pixel_height = 1.0/dimension[1];',
		'vec3 color = vec3(0.0);',
		'color += 0.0*(texture2D(texture, vUV).rgb);',
		'color += 1.0*(texture2D(texture, vec2(vUV.x-pixel_width, vUV.y-pixel_height)).rgb);',
		'color += 0.0*(texture2D(texture, vec2(vUV.x, vUV.y-pixel_height)).rgb);',
		'color += -1.0*(texture2D(texture, vec2(vUV.x+pixel_width, vUV.y-pixel_height)).rgb);',
		'color += 0.0*(texture2D(texture, -1.0*vec2(vUV.x-pixel_width, vUV.y)).rgb);',
		'color += 0.0*(texture2D(texture, -1.0*vec2(vUV.x+pixel_width, vUV.y)).rgb);',
		'color += -1.0*(texture2D(texture, -1.0*vec2(vUV.x-pixel_width, vUV.y+pixel_height)).rgb);',
		'color += 0.0*(texture2D(texture, -1.0*vec2(vUV.x, vUV.y+pixel_height)).rgb);',
		'color += 1.0*(texture2D(texture, -1.0*vec2(vUV.x+pixel_width, vUV.y-pixel_height)).rgb);',
		'gl_FragColor = vec4(color, 1.0);',

		'}',
	].join('\n');

	console.log(fShader);
	var texture_loader = new THREE.TextureLoader();
	var texture = texture_loader.load("/static/images/snow.jpg");

	var dimension = [window.innerWidth, window.innerHeight];

	// using shader we define a material variable and pass uniforms, vertexShader, fragmentShader 
	var material = new THREE.ShaderMaterial({ 
		uniforms: {
			texture: { type: 't', value: texture},
			dimension: {type: 'v2', value: dimension},
		},
		vertexShader: vShader,
		fragmentShader: fShader,
		transparent: true,
	});

	window.material = material;

	// adding mesh to the scene
	var mesh = new THREE.Mesh(plane, material);
	scene.add( mesh );


	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

	window.addEventListener('resize', onWindowResize, false);
	animate();


});

