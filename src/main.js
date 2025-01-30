document.addEventListener("DOMContentLoaded", function () {
    const sceneEl = document.querySelector("a-scene");
    const modelEntity = document.getElementById("chairModel");

    if (!sceneEl || !modelEntity) {
        console.error("Scene or model entity not found.");
        return;
    }

    // Get Three.js scene from A-Frame
    const THREE = AFRAME.THREE;
    // Create a GLTF loader instance using A-Frame's Three.js
    const loader = new THREE.GLTFLoader();

    loader.load(
        './chair.glb', 
        function (gltf) {
            let model = gltf.scene;
            model.scale.set(1, 1, 1); // Adjust size if needed
            model.position.set(0, 0, 0); // Adjust placement
            model.rotation.y = Math.PI; // Rotate for proper orientation

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
