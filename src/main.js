document.addEventListener("DOMContentLoaded", function () {
    const modelEntity = document.getElementById("chairModel");

    if (!modelEntity) {
        console.error("Model entity not found.");
        return;
    }

    // Get Three.js scene from A-Frame
    const THREE = AFRAME.THREE;
    // Create a GLTF loader instance using A-Frame's Three.js
    const loader = new THREE.GLTFLoader();

    loader.load(
        'https://raw.githubusercontent.com/ahmed-esh/arq/main/public/chair.glb',  // Updated model path
        function (gltf) {
            let model = gltf.scene;
            // Adjust these values to make the model visible and properly sized
            model.scale.set(0.1, 0.1, 0.1); // Made smaller
            model.position.set(0, 0.5, 0); // Lifted slightly above marker
            model.rotation.x = -Math.PI / 2; // Rotate to face up

            modelEntity.object3D.add(model);
            console.log("Model loaded successfully");
        },
        function (xhr) {
            console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        function (error) {
            console.error("Error loading the model: ", error);
        }
    );
});

