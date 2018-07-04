var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594

function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.click();

		// URL.revokeObjectURL( url ); breaks Firefox...

	}


function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 100;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

var orbit = new THREE.OrbitControls( camera );
orbit.enableZoom = false;

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

var lights = [];
			lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
			lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
			lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

			lights[ 0 ].position.set( 0, 200, 0 );
			lights[ 1 ].position.set( 100, 200, 100 );
			lights[ 2 ].position.set( - 100, - 200, - 100 );

			scene.add( lights[ 0 ] );
			scene.add( lights[ 1 ] );
			scene.add( lights[ 2 ] );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 4, 40, 40 );
var material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide } );
var base = new THREE.Mesh( geometry, material );
base.position.set( 0, -18, -18 );

// Add cube to Scene

var group = new THREE.Group();
group.add ( base );

// Start drawing QR codes

var geometry = new THREE.BoxGeometry( 4, 1, 1 );
var material = new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0x002534, side: THREE.DoubleSide } );
var QR1 = new THREE.Mesh( geometry, material );
QR1.position.set( 2, 0, 0 );

group.add(QR1);

scene.add( group );

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  group.rotation.x += 0.005;
  group.rotation.y += 0.005;

  // Render the scene
  renderer.render(scene, camera);
};

render();


// EXPORT TO STL for 3D PRINTING
var exporter = new THREE.STLExporter();
saveString( exporter.parse( scene ), 'model.stl' );