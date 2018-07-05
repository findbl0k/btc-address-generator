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
    console.log(result);

    // destroy the old models
    scene.remove(group);

    // generate meshes for private key QR code
	var private_qr_width = result[1].getModuleCount();

	// generate meshes for public key QR code
    var public_qr_width = result[4].getModuleCount();

    console.log(private_qr_width);
    console.log(public_qr_width);

    var geometry = new THREE.BoxGeometry( 4, private_qr_width+4, private_qr_width+4 );
    var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, emissive: 0x072534, side: THREE.DoubleSide } );
    var base = new THREE.Mesh( geometry, material );
    base.position.set( 0, (private_qr_width-1)/2, (private_qr_width-1)/2 );

	// Add plastic wallet to Scene

    group = new THREE.Group();
    group.add ( base );

    // Start drawing QR codes - private key first
    for (i = 0; i < private_qr_width; i++) { // i defines height position for each block
        for (j = 0; j < private_qr_width; j++) { // j defines length position for each block

            if(result[1].isDark(i,j)){ // generate black for each qr.isDark == true

                var geometryQR1 = new THREE.BoxGeometry( 2, 1, 1 );
                var materialQR1 = new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0x000000, side: THREE.DoubleSide } );
                var QR1 = new THREE.Mesh( geometryQR1, materialQR1 );
                QR1.position.set( 2, i, j );

                group.add(QR1);

            }
        }
    }

    // Now draw the public key QR code
    for (i = 0; i < public_qr_width; i++) { // i defines height position for each block
        for (j = 0; j < public_qr_width; j++) { // j defines length position for each block

            if(result[4].isDark(i,j)){ // generate black for each qr.isDark == true

                var geometryQR2 = new THREE.BoxGeometry( 2, 1, 1 );
                var materialQR2 = new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0x000000, side: THREE.DoubleSide } );
                var QR2 = new THREE.Mesh( geometryQR1, materialQR1 );
                QR2.position.set( -2, i, j );

                group.add(QR2);

            }
        }
    }

    scene.add( group );
}

function rotateMe(mesh) {
    mesh.rotation.x += 0.001;
    mesh.rotation.y -= 0.005;
}

var angle = 0;
var cameraRadius = 100;

function rotateCamera() {
// Use Math.cos and Math.sin to set camera X and Z values based on angle.
    camera.position.x = cameraRadius * Math.cos( angle )+100;
    camera.position.z = cameraRadius * Math.sin( angle )+100;
    angle += 0.01;
}

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

var orbit = new THREE.OrbitControls( camera );
orbit.enableZoom = false;
orbit.autoRotate=true;
camera.position.set( 50, 70, 70 );

// Configure renderer clear color
renderer.setClearColor("#000FFF");

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