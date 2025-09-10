AFRAME.registerComponent('clipping-plane', {
  schema: {
    dir: { type: 'vec3', default: { x: 1, y: 0, z: 0 } },
    offset: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    enabled: { type: 'boolean', default: true },
  },

  init: function () {
    const entityPosition = this.el.getAttribute('position') || { x: 0, y: 0, z: 0 };

    // Always use entity position with offset
    const planePosition = new THREE.Vector3(
      entityPosition.x + this.data.offset.x,
      entityPosition.y + this.data.offset.y,
      entityPosition.z + this.data.offset.z
    );

    // Get the local direction and transform it by the entity's rotation
    const localDir = new THREE.Vector3(this.data.dir.x, this.data.dir.y, this.data.dir.z);
    localDir.normalize();

    // Apply entity rotation to the direction vector
    const entityRotation = this.el.object3D.rotation;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromEuler(entityRotation);
    const worldDir = localDir.applyMatrix4(rotationMatrix);

    // Create plane using setFromNormalAndCoplanarPoint
    this.clippingPlane = new THREE.Plane();
    this.clippingPlane.setFromNormalAndCoplanarPoint(worldDir, planePosition);

    if (this.el.getAttribute("gltf-model")) {
      this.setClippingPlaneGltf();
    } else {
      this.setClippingPlane();
    }

    const renderer = this.el.sceneEl.renderer;
    renderer.localClippingEnabled = true;
    renderer.clippingPlanes = [];
  },

  update: function (oldData) {
    if (oldData.dir !== this.data.dir || oldData.offset !== this.data.offset) {
      const entityPosition = this.el.getAttribute('position') || { x: 0, y: 0, z: 0 };

      // Always use entity position with offset
      const planePosition = new THREE.Vector3(
        entityPosition.x + this.data.offset.x,
        entityPosition.y + this.data.offset.y,
        entityPosition.z + this.data.offset.z
      );

      // Get the local direction and transform it by the entity's rotation
      const localDir = new THREE.Vector3(this.data.dir.x, this.data.dir.y, this.data.dir.z);
      localDir.normalize();

      // Apply entity rotation to the direction vector
      const entityRotation = this.el.object3D.rotation;
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationFromEuler(entityRotation);
      const worldDir = localDir.applyMatrix4(rotationMatrix);

      this.clippingPlane.setFromNormalAndCoplanarPoint(worldDir, planePosition);
    }

    if (this.el.getAttribute("gltf-model")) {
      this.updateClippingPlaneGltf();
    } else {
      this.updateClippingPlane();
    }
  },

  updateClippingPlane: function () {
    this.el.object3D.traverse((node) => {
      if (!node.isMesh) return;
      node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
      node.material.needsUpdate = true;
    });
  },

  updateClippingPlaneGltf: function () {
    if (this.modelLoaded) {
      this.updateClippingPlane();
    }
  },

  setClippingPlane: function () {
    this.el.object3D.traverse((node) => {
      if (!node.isMesh) return;
      node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
      node.material.clipShadows = true;
      node.material.side = THREE.DoubleSide;
      node.castShadow = true;
      node.material.needsUpdate = true;
    });
  },

  setClippingPlaneGltf: function () {
    this.el.addEventListener('model-loaded', (e) => {
      this.modelLoaded = true;
      const object = e.detail.model;
      object.traverse((node) => {
        if (!node.isMesh) return;
        node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
        node.material.clipShadows = true;
        node.material.side = THREE.DoubleSide;
        node.castShadow = true;
        node.material.needsUpdate = true;
      });
    });
  }
});
