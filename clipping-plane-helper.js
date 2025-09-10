AFRAME.registerComponent('clipping-plane-helper', {
  schema: {
    offset: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    size: { type: 'number', default: 3 },
    color: { type: 'color', default: '#ff00ff' },
    opacity: { type: 'number', default: 0.5 },
    enabled: { type: 'boolean', default: false }
  },

  init: function () {
    this.createHelperPlane();

    // Listen for changes in the clipping-plane component
    this.el.addEventListener('componentchanged', (e) => {
      if (e.detail.name === 'clipping-plane') {
        this.updateHelperPlane();
      }
    });
  },

  update: function (oldData) {
    if (this.helperPlane) {
      this.el.object3D.remove(this.helperPlane);
      this.helperPlane.geometry.dispose();
      this.helperPlane.material.dispose();
      this.helperPlane = null;
    }
    this.createHelperPlane();
  },

  createHelperPlane: function () {
    const geometry = new THREE.PlaneGeometry(this.data.size, this.data.size);

    const material = new THREE.MeshBasicMaterial({
      color: this.data.color,
      transparent: true,
      opacity: this.data.opacity,
      side: THREE.DoubleSide,
      wireframe: false,
      depthWrite: false
    });

    this.helperPlane = new THREE.Mesh(geometry, material);

    this.updateHelperPlane();

    this.el.object3D.add(this.helperPlane);
  },

  updateHelperPlane: function () {
    if (!this.helperPlane) return;

    const clippingComponent = this.el.components['clipping-plane'];
    if (!clippingComponent) {
      console.warn('clipping-plane-helper requires a clipping-plane component on the same entity');
      return;
    }

    // Always use the same position logic as clipping-plane
    const dirToUse = clippingComponent.data.dir;
    const localDir = new THREE.Vector3(dirToUse.x, dirToUse.y, dirToUse.z);
    localDir.normalize();

    // Don't apply entity rotation here since the helper is a child of the entity
    // The entity's rotation will be applied automatically

    // Set position relative to entity (before applying offset)
    this.helperPlane.position.set(0, 0, 0); // Start at entity center
    this.helperPlane.position.add(new THREE.Vector3(
      this.data.offset.x,
      this.data.offset.y,
      this.data.offset.z
    ));

    // Set rotation to match the local direction (no entity rotation applied)
    const defaultNormal = new THREE.Vector3(0, 0, 1);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(defaultNormal, localDir);
    this.helperPlane.setRotationFromQuaternion(quaternion);

    this.helperPlane.material.color.setStyle(this.data.color);
    this.helperPlane.material.opacity = this.data.opacity;
    this.helperPlane.visible = this.data.enabled;

    this.helperPlane.scale.setScalar(this.data.size);
  },

  remove: function () {
    if (this.helperPlane) {
      this.el.object3D.remove(this.helperPlane);
      this.helperPlane.geometry.dispose();
      this.helperPlane.material.dispose();
      this.helperPlane = null;
    }
  }
});




