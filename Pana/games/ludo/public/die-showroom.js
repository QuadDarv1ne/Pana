import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { rendererOptions, bindRenderer } from '/engine/settings.js';
import { createLudoDie } from './board-model.js';

// The showroom uses the same mesh and materials as the die on the table.
export function createDieShowroom(canvas){
  const renderer=new THREE.WebGLRenderer(rendererOptions({canvas,alpha:true}));
  const unbind=bindRenderer(renderer,2,{fit:'canvas'});
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,20);
  camera.position.set(.85,.75,1.2);
  scene.add(new THREE.HemisphereLight(0xffffff,0x686080,3));
  for(const [x,y,z,power] of [[2,3,4,4],[-3,1,-2,3]]){const light=new THREE.DirectionalLight(0xffffff,power);light.position.set(x,y,z);scene.add(light);}
  const controls=new OrbitControls(camera,canvas);controls.target.set(0,.215,0);controls.enablePan=false;controls.minDistance=.75;controls.maxDistance=2.4;controls.enableDamping=true;
  let model=null,active=false;
  const resize=()=>{const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  const animate=()=>{controls.update();renderer.render(scene,camera);};
  return {
    show(id){if(model?.userData.look===id)return;model?.userData.dispose();if(model)scene.remove(model);model=createLudoDie({look:id});scene.add(model);},
    active(value){if(active===value)return;active=value;resize();renderer.setAnimationLoop(value?animate:null);},
    dispose(){renderer.setAnimationLoop(null);observer.disconnect();controls.dispose();model?.userData.dispose();unbind();renderer.dispose();}
  };
}
