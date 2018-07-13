var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround for .stl file saving

function save( blob, filename ) { // for .stl file saving

	link.href = URL.createObjectURL( blob );
	link.download = filename || 'data.json';
	link.click();
}

function saveString( text, filename ) { // for .stl file saving
	save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function exportSTL(){ // EXPORT TO STL for 3D PRINTING

    var exporter = new THREE.STLExporter();
    saveString( exporter.parse( scene ), 'model.stl' );
}

function add_qr_to_scene(result){

    // destroy the old models
    scene.remove(group);

    // generate meshes for private key QR code
	var private_qr_width = result[1].getModuleCount();

	// generate meshes for public key QR code
    var public_qr_width = result[4].getModuleCount();

    var geometry = new THREE.BoxGeometry( 4, private_qr_width+4, private_qr_width+4 );
    var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, emissive: 0x072534, side: THREE.DoubleSide } );
    var base = new THREE.Mesh( geometry, material );
    base.position.set( 0, (private_qr_width-1)/2, (private_qr_width-1)/2 );

	// Add plastic wallet to Scene

    group = new THREE.Group();
    group.add ( base );

    // Start drawing QR codes - private key first
	var materialQR = new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0x000000, side: THREE.DoubleSide } );
	var geometryQR = new THREE.BoxGeometry( 2, 1, 1 );
	
    for (i = 0; i < private_qr_width; i++) { // i defines height position for each block
        for (j = 0; j < private_qr_width; j++) { // j defines length position for each block

            if(result[1].isDark(i,j)){ // generate black for each qr.isDark == true

                var QR1 = new THREE.Mesh( geometryQR, materialQR );
                QR1.position.set( 2, i, j );

                group.add(QR1);
            }
        }
    }

    // Now draw the public key QR code
    for (i = 0; i < public_qr_width; i++) { // i defines height position for each block
        for (j = 0; j < public_qr_width; j++) { // j defines length position for each block

            if(result[4].isDark(i,j)){ // generate black for each qr.isDark == true

                var QR2 = new THREE.Mesh( geometryQR, materialQR );
                QR2.position.set( -2, i+(private_qr_width-public_qr_width)/2, j+(private_qr_width-public_qr_width)/2); //centered with respect to the base

                group.add(QR2);
            }
        }
    }
	
	// now add edges to private key side for robustness
	var geometryEdge1 = new THREE.BoxGeometry( 2, private_qr_width+4, 1 );
    var Edge1 = new THREE.Mesh( geometryEdge1, material ); //reuse white from base
	Edge1.position.set( 2, (private_qr_width-1)/2, -2 );
	
	
	group.add(Edge1);
	// now add edges to public key side for robustness
	
	

    scene.add( group ); // add base, and both QR's to three.js 3D scene
}

var scene3d = document.getElementById("scene3d"); //we'll render at the scene3d div

var angle = 0;
var cameraRadius = 100;

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, scene3d.offsetWidth/scene3d.offsetHeight, 0.1, 1000 );

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

var orbit = new THREE.OrbitControls( camera );
//orbit.enabled = false;
orbit.enableZoom = false;
orbit.autoRotate=true;
camera.position.set( 50, 40, 50 );

// Configure renderer clear color
renderer.setClearColor("#FFFFFF");

// Configure renderer size
renderer.setSize( scene3d.offsetWidth, 300 );

// Append Renderer to DOM
scene3d.appendChild( renderer.domElement );

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

var group = new THREE.Group();
scene.add( group );

// Render Loop
var render = function () {
  requestAnimationFrame( render );

    // orbit.autoRotate is set to true, must call update() in animation loop
    orbit.update();

  // Render the scene
  renderer.render(scene, camera);
};

render();