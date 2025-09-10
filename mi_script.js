AFRAME.registerComponent('clipping-plane', {
      schema: {
        dir: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        position: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        useEntityPos: { type: 'boolean', default: true },
        enabled: { type: 'boolean', default: true },
      },

      init: function () {
        const renderer = this.el.sceneEl.renderer;
        const entityPosition = this.el.getAttribute('position') || { x: 0, y: 0, z: 0 };
        const position = this.data.useEntityPos ? entityPosition : this.data.position;
        const planePosition = new THREE.Vector3(position.x, position.y,position.z );
        const dir = new THREE.Vector3(this.data.dir.x,this.data.dir.y,this.data.dir.z);
        
        dir.normalize();
        this.clippingPlane = new THREE.Plane();
        this.clippingPlane.setFromNormalAndCoplanarPoint(dir, planePosition);

        if (this.el.getAttribute("gltf-model")) {
          this.el.addEventListener('model-loaded', (e) => {
          this.modelLoaded = true;
          const object = e.detail.model;
          object.traverse((node) => {
            if (!node.isMesh) return;
            node.material.clipShadows = true;
            node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
            node.material.side = THREE.DoubleSide;
            node.castShadow = true;
            node.material.needsUpdate = true;
          });
        });
        } else {
          this.el.object3D.traverse((node) => {
          if (!node.isMesh) return;
          node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
          node.material.clipShadows = true;
          node.material.side = THREE.DoubleSide;
          node.castShadow = true;
          node.material.needsUpdate = true;
        });
        }
        renderer.localClippingEnabled = true;        
      },

update: function (oldData) {
        if (oldData.dir !== this.data.dir || oldData.position !== this.data.position || oldData.useEntityPos !== this.data.useEntityPos) {
          const entityPosition = this.el.getAttribute('position') || { x: 0, y: 0, z: 0 };
          const position = this.data.useEntityPos ? entityPosition : this.data.position;
          const planePosition = new THREE.Vector3(position.x, position.y, position.z);
          const dir = new THREE.Vector3(this.data.dir.x,this.data.dir.y,this.data.dir.z);

          this.clippingPlane.setFromNormalAndCoplanarPoint(dir, planePosition);
        }

        if (this.el.getAttribute("gltf-model")) {
          this.el.object3D.traverse((node) => {
          if (!node.isMesh) return;
          node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
          node.material.needsUpdate = true;
          node.material.clipShadows = true;
        });
        } else {
          this.el.object3D.traverse((node) => {
          if (!node.isMesh) return;
          node.material.clippingPlanes = this.data.enabled ? [this.clippingPlane] : [];
          node.material.needsUpdate = true;
          node.material.clipShadows = true;
        });
        }
      },
    });

AFRAME.registerComponent('mi_ccplane',{
        schema: {
        dir: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }
    },
  init:function(){
    const direc = new THREE.Vector3(this.data.dir.x,this.data.dir.y,this.data.dir.z);
    var clippingPlane,planeHelper;

    clippingPlane = new THREE.Plane(new THREE.Vector3(direc.x,direc.y,direc.z)); 
    planeHelper = new THREE.PlaneHelper(clippingPlane, 3, 0xff00ff); 
    this.el.object3D.add(planeHelper);
  }
});

AFRAME.registerComponent('mi_ccplane2',{
        schema: {
        dir: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }
    },
  init:function(){
    const direc = new THREE.Vector3(this.data.dir.x,this.data.dir.y,this.data.dir.z);
    var clippingPlane,planeHelper;

    clippingPlane = new THREE.Plane(new THREE.Vector3(direc.x,direc.y,direc.z),0); 
    planeHelper = new THREE.PlaneHelper(clippingPlane, 3, 0xff00ff); 
    this.el.object3D.add(planeHelper);
  }
});

const myCheckbox = document.getElementById('button6');
const entidad = document.querySelector('#modelo3d');

document.getElementById('boton1').addEventListener('click', function() {
  entidad.setAttribute('clipping-plane', 'enabled', 'false');
});

document.getElementById('boton2').addEventListener('click', function() {
  entidad.setAttribute('clipping-plane', 'enabled', 'true');
});

document.getElementById('boton3').addEventListener('click', function() {
 entidad.setAttribute('clipping-plane', {dir: {x: 0, y: -0.22, z: 0},enabled:'true'});
});

document.getElementById('boton4').addEventListener('click', function() {
 entidad.setAttribute('clipping-plane', {dir: {x: -1, y: 0, z: 0},enabled:'true'});
});

document.getElementById('boton5').addEventListener('click', function() {
 entidad.setAttribute('clipping-plane', {dir: {x: 0, y: 0, z: -1},enabled:'true'});
});

myCheckbox.addEventListener('change', function() {
  const ldir= entidad.components['clipping-plane'].data.dir;//solo lectura
  const plane1 = document.querySelector('#plano1');
  const plane2 = document.querySelector('#plano2');
  const plane3 = document.querySelector('#plano3');
          plane1.setAttribute('visible', 'false');
          plane2.setAttribute('visible', 'false');
          plane3.setAttribute('visible', 'false'); 
       if (this.checked) {
         if(ldir.z==-1){
              plane1.setAttribute('visible','true');
           }else if(ldir.x==-1)
             {
              plane2.setAttribute('visible','true');
             }else if(ldir.y==-0.22){
              plane3.setAttribute('visible','true');
        }}});