console.log('AR Hit Test component registered');

AFRAME.registerComponent('ar-hit-test', {
    schema: {
        target: {type: 'selector'}
    },

    init: function () {
        this.xrHitTestSource = null;
        this.viewerSpace = null;
        this.refSpace = null;

        this.el.sceneEl.renderer.xr.addEventListener('sessionstart', () => this.sessionStart());
        this.el.sceneEl.renderer.xr.addEventListener('sessionend', () => this.sessionEnd());

        this.placed = false;
        this.placeButton = document.getElementById('place-button');
        this.reticle = document.getElementById('reticle');

        if (this.placeButton) {
            this.placeButton.addEventListener('click', () => this.placeFurniture());
        }
    },

    sessionStart: async function () {
        const session = this.el.sceneEl.renderer.xr.getSession();
        
        this.viewerSpace = await session.requestReferenceSpace('viewer');
        this.refSpace = await session.requestReferenceSpace('local-floor');
        
        this.xrHitTestSource = await session.requestHitTestSource({
            space: this.viewerSpace
        });
    },

    sessionEnd: function () {
        if (this.xrHitTestSource) {
            this.xrHitTestSource.cancel();
            this.xrHitTestSource = null;
        }
    },

    tick: function () {
        if (this.el.sceneEl.is('ar-mode') && !this.placed) {
            this.detectSurface();
        }
    },

    detectSurface: function () {
        const frame = this.el.sceneEl.frame;
        if (!frame) return;

        const xrViewerPose = frame.getViewerPose(this.refSpace);
        if (this.xrHitTestSource && xrViewerPose) {
            const hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(this.refSpace);

                this.reticle.setAttribute('visible', 'true');
                this.reticle.setAttribute('position', {
                    x: pose.transform.position.x,
                    y: pose.transform.position.y,
                    z: pose.transform.position.z
                });
                this.placeButton.style.display = 'block';
            }
        }
    },

    placeFurniture: function () {
        if (this.placed) return;

        console.log('Placing furniture...');
        
        // Get reticle position
        const position = this.reticle.getAttribute('position');
        console.log('Reticle position:', position);
        
        // Create new furniture entity with the correct path
        const furniture = document.createElement('a-entity');
        furniture.setAttribute('gltf-model', '#chair-model'); // Use the asset ID instead of direct URL
        furniture.setAttribute('position', position);
        furniture.setAttribute('scale', '0.1 0.1 0.1');
        furniture.setAttribute('class', 'clickable');
        furniture.setAttribute('draggable', '');
        furniture.setAttribute('shadow', 'cast: true');
        
        // Add load event listener
        furniture.addEventListener('model-loaded', () => {
            console.log('Model loaded successfully');
        });
        
        // Add error event listener
        furniture.addEventListener('model-error', (error) => {
            console.error('Error loading model:', error);
        });
        
        this.el.sceneEl.appendChild(furniture);
        
        // Hide reticle and place button
        this.reticle.setAttribute('visible', 'false');
        this.placeButton.style.display = 'none';
        this.placed = true;

        console.log('Furniture entity added to scene');
        
        // Show placement success message
        document.getElementById('instructions').textContent = 'Furniture placed! You can drag to move it.';
    }
});

// Draggable component for moving furniture
AFRAME.registerComponent('draggable', {
    init: function () {
        this.el.addEventListener('mousedown', this.onDragStart.bind(this));
        this.el.addEventListener('mouseup', this.onDragEnd.bind(this));
        this.el.addEventListener('mousemove', this.onDrag.bind(this));
        this.isDragging = false;
    },

    onDragStart: function () {
        this.isDragging = true;
    },

    onDragEnd: function () {
        this.isDragging = false;
    },

    onDrag: function (event) {
        if (!this.isDragging) return;
        
        // Update position based on hit test
        // This is a simplified version - you might want to add more complex dragging logic
        const position = event.detail.intersection.point;
        this.el.setAttribute('position', position);
    }
});

