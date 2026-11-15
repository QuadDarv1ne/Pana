import * as THREE from 'three';
import { loc } from '/engine/i18n.js';
import { disposeModel } from '/engine/models/props/game-table.js';

// A bounded, scrub-friendly pool. Samples describe the current frame rather
// than spawning particles, so replay and low frame rates cannot accumulate FX.
export function createAnimationFx(root) {
  const pool=[],labels=new Map();let used=0;
  const sphere=new THREE.SphereGeometry(1,8,6),ring=new THREE.TorusGeometry(1,.035,4,24);
  function mesh(geometry,pos,size,opacity,color){
    if(used>=180||opacity<=0||size<=0)return;
    let m=pool[used++];
    if(!m){m=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({transparent:true,depthWrite:false}));root.add(m);pool.push(m);}
    m.geometry=geometry;m.visible=true;m.position.copy(pos);m.rotation.set(0,0,0);m.scale.setScalar(size);m.material.color.set(color);m.material.opacity=Math.min(1,opacity);return m;
  }
  function puff(pos,size=.08,opacity=.6,color='#ffffff'){mesh(sphere,pos,size,opacity,color);}
  function star(pos,size=.08,angle=0,opacity=1,color='#ffd23f'){
    const m=mesh(sphere,pos,size,opacity,color);if(m){m.scale.set(size*.4,size,size*.4);m.rotation.set(angle,angle,angle);}
  }
  function burst(pos,t,{count=12,radius=.6,color='#ffd23f',life=.7,multi=false,seed=0}={}){
    if(t<0||t>life)return;const f=t/life;
    for(let k=0;k<Math.min(count,35);k++){const a=k*2.399+seed;star(pos.clone().add(new THREE.Vector3(Math.cos(a)*radius*f,Math.sin(k*3.1)*radius*f+.25*f,Math.sin(a)*radius*f)),.06*(1-f),a+t,1-f,multi?['#ff4b4b','#ffc629','#3d7bf2','#2ad1b2'][k%4]:color);}
  }
  function dust(pos,t,{count=8,size=.13,spread=.5,color='#ffffff',life=.7,seed=0}={}){
    if(t<0||t>life)return;const f=t/life;
    for(let k=0;k<Math.min(count,25);k++){const a=k*2.399+seed;puff(pos.clone().add(new THREE.Vector3(Math.cos(a)*spread*f,.06+Math.sin(f*Math.PI)*.18,Math.sin(a)*spread*f)),size*(.3+f),.65*(1-f),color);}
  }
  function ringAt(pos,t,color='#ffd23f',{max=3,life=.7}={}){
    if(t<0||t>life)return;const m=mesh(ring,pos,.03+t/life*max*.2,1-t/life,color);if(m){m.position.y+=.01;m.rotation.x=-Math.PI/2;}
  }
  function text(word,color,pos,t,{life=1.2,size=.65,hold=false,tilt=0}={}){
    if(t<0||(!hold&&t>life))return;
    const key=`${word}:${color}`;let label=labels.get(key);
    if(!label){
      // Dynamic counts do not grow the cache indefinitely.
      if(labels.size>=96){const [old,item]=labels.entries().next().value;disposeModel(item);labels.delete(old);}
      const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;
      const c=canvas.getContext('2d');c.font='900 56px Nunito, sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=9;c.lineJoin='round';c.strokeStyle='#2b2030';c.strokeText(loc(String(word)),384,64,740);c.fillStyle=color;c.fillText(loc(String(word)),384,64,740);
      const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
      label=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,depthWrite:false}));root.add(label);labels.set(key,label);
    }
    label.visible=true;label.position.copy(pos);label.position.y+=Math.min(t,.8)*.08;label.scale.set(size*2,size/3,1);label.material.rotation=tilt;label.material.opacity=hold?1:Math.min(1,(life-t)*4);
  }
  return {puff,star,burst,dust,ring:ringAt,text,badge:(n,c,p,t,o)=>text(String(n),c,p,t,o),
    confetti:(p,t,o={})=>burst(p,t,{count:o.count,radius:o.power||1,multi:true,life:1.4,seed:o.seed}),
    reset(){used=0;for(const p of pool)p.visible=false;for(const p of labels.values())p.visible=false;},
    dispose(){for(const m of pool){m.material.dispose();m.removeFromParent();}sphere.dispose();ring.dispose();for(const m of labels.values())disposeModel(m);labels.clear();},
  };
}
