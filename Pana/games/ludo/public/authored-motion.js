import * as THREE from 'three';
import { createAuthoredLibrary } from './authored-library.js';
import { createAnimationFx } from './animation-fx.js';
import { createMotionProps } from './motion-props.js';
import { animationGroup } from './animation-catalog.js';
import { COLORS, ludoTrack } from './rules.js';
import { boardPoint } from './board-model.js';
import { disposeModel } from '/engine/models/props/game-table.js';
import { createCaptureLibrary } from './capture-library.js';
import { buildCharacter } from '/engine/models/characters/pana/avatar-model.js';
import { loadAvatar, normalizeAvatar } from '/engine/avatar.js';

const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const easeOut=v=>1-(1-clamp(v))**3;
const easeIn=v=>clamp(v)**3;
const yawTo=(a,b)=>Math.atan2(b.x-a.x,b.z-a.z);
const up=(p,y)=>p.clone().add(new THREE.Vector3(0,y,0));
const pose=p=>({position:p.position.clone(),rotation:p.rotation.clone(),scale:p.scale.clone(),visible:p.visible});
const restore=(p,b)=>{p.position.copy(b.position);p.rotation.copy(b.rotation);p.scale.copy(b.scale);p.visible=b.visible;};

// One pooled library per board. Proxy transforms keep the authored board at
// y=.21 while the real game sits on the shared table at y=1.67. No demo pawn,
// renderer, room, random dice stream or UI is imported.
export function createAuthoredAnimator({root,pawns,seats=4,camera,die,audio,baseY=1.67,avatarFor=()=>loadAvatar()}) {
  const offset=baseY-.21,stage=new THREE.Group();stage.position.y=offset;root.add(stage);
  const models=pawns.map(p=>p.model||p),proxies=models.map(p=>{const q=new THREE.Group();q.userData={...p.userData};return q;});
  const FX=createAnimationFx(stage),dieProxy=new THREE.Group(),dieSpin=new THREE.Group();dieProxy.add(dieSpin);
  const table=ludoTrack(seats),props=[];let active=null,library,character=null,disposed=false;
  function local(p){const v=p.clone();v.y-=offset;return v;}
  function pathAt(path,w){const n=path.length-1,k=Math.max(0,Math.min(n,w)),i=Math.min(n-1,Math.floor(k));return path[i].clone().lerp(path[i+1],k-i);}
  function actualCell(seat,progress,piece=0){const [x,z]=boardPoint(seat,progress,piece,seats);return new THREE.Vector3(x,.21,z);}
  function cell(seat,progress,piece=0){
    const a=active;
    if(a&&seat===a.seat){
      if(a.group==='entry')return progress<0&&piece!==a.piece?a.bases[seat*4+piece].position.clone():(progress<0?a.path[0]:a.path.at(-1)).clone();
      if(a.group==='home'){const span=a.style==='cohete'?2:a.style==='sudada'?3:4;return pathAt(a.path,(a.path.length-1)*clamp((progress-(table.home-span))/span));}
      if(a.group==='safe')return pathAt(a.path,progress);
      if(['yard','idle','penalty'].includes(a.group))return a.bases[seat*4+piece]?.position.clone()||actualCell(seat,progress,piece);
    }
    return actualCell(seat,progress,piece);
  }
  function face(p,o={}){
    const f=p.userData.face;if(!f)return;
    const blink=!o.noBlink&&(ctx.time+(f.seed||0)*.37)%4.1<.12?.08:1;
    f.eyes.forEach((eye,i)=>{eye.scale.set(o.size||1,Math.max(.04,o.open??1)*blink,1);f.pupils[i].position.set((o.lx||0)*.013,(o.ly||0)*.01,.024);f.pupils[i].scale.setScalar(o.pupil||1);});
    f.smile.visible=o.mouth!=='o';f.open.visible=o.mouth==='o';f.open.scale.setScalar(o.mouthSize||1);f.smile.scale.set(1,o.mouth==='flat'?.15:1,1);f.smile.rotation.z=o.mouth==='sad'?0:Math.PI;
  }
  function settle(p,t,amount=1.6){if(t<0)return;const k=.13*amount*Math.exp(-t*7)*Math.cos(t*18);p.scale.set(1+k*.5,1-k,1+k*.5);}
  function hopPath(p,path,c,a=0,b=1,options={}){
    const u=clamp((c-a)/(b-a)),w=u*(path.length-1),f=w-Math.floor(w);p.position.copy(pathAt(path,w));p.position.y+=Math.sin(f*Math.PI)*.3;p.rotation.set(0,ctx.pathYaw(path,w),0);face(p,{mouth:'smile'});
    return {landT:b,yaw:p.rotation.y,at:p.position};
  }
  function hopTo(x,c,a,b,from,to){const u=smooth((c-a)/(b-a));x.mover.position.copy(from).lerp(to,u);x.mover.position.y+=Math.sin(u*Math.PI)*.35;x.mover.rotation.set(0,yawTo(from,to),0);}
  function landPose(p,c,t,pos,yaw){p.position.copy(pos);p.rotation.set(0,yaw,0);settle(p,(c-t)*active.D);face(p,{mouth:'smile',open:.45});}
  function flyHome(x,c,from,a,b,{height=1.3,spinX=3,spinZ=2}={}){const u=clamp((c-a)/(b-a));x.victim.position.copy(from).lerp(x.VB,u);x.victim.position.y+=Math.sin(u*Math.PI)*height;x.victim.rotation.set(u*Math.PI*spinX,0,u*Math.PI*spinZ);face(x.victim,{mouth:'o',open:1.3});}
  function add(p){stage.add(p);props.push(p);return p;}
  function mesh(geo,color){return add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,transparent:true})));}
  const spring=add(createMotionProps('spring','#ff5a8a')),tunnel=add(createMotionProps('tunnel','#a97a50'));
  // These meshes were shared with the original ten camino tricks in the demo.
  const Hi=spring,ir=mesh(new THREE.CylinderGeometry(.14,.14,.02,16),'#ff5a8a');
  const ua=tunnel.children.slice(0,2),Ei=tunnel.userData.mound;
  const crowns=Array.from({length:4},()=>mesh(new THREE.CylinderGeometry(.09,.12,.08,5,1,true),'#ffd23f'));
  const bubble=mesh(new THREE.SphereGeometry(.25,12,8),'#bfefff');bubble.material.opacity=.28;
  const wall=mesh(new THREE.BoxGeometry(.5,.3,.06),'#a97a50');
  const cloud=add(new THREE.Group()),bump=mesh(new THREE.SphereGeometry(.09,10,8),'#ff8fc8');
  for(const [x,y,z,r] of [[0,0,0,.28],[.26,-.05,.04,.2],[-.27,-.04,0,.21],[.1,.13,-.05,.2],[-.13,.11,.08,.18]]){
    const puff=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),new THREE.MeshStandardMaterial({color:'#6d6578'}));puff.position.set(x,y,z);puff.scale.y=.8;cloud.add(puff);
  }
  const mallet=add(new THREE.Group());
  const handle=new THREE.Mesh(new THREE.CylinderGeometry(.022,.026,.5,10),new THREE.MeshStandardMaterial({color:'#9a6234'}));handle.position.y=.25;mallet.add(handle);
  const head=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.34,16),new THREE.MeshStandardMaterial({color:'#e8443a'}));head.rotation.x=Math.PI/2;head.position.y=.5;mallet.add(head);
  const shape=new THREE.Shape();[[0,1.5],[-.15,.95],[0,.95],[-.12,.4],[.02,.42],[-.05,0],[.16,.55],[.04,.53],[.17,1.02],[.05,1.02],[.18,1.5]].forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
  const bolt=mesh(new THREE.ShapeGeometry(shape),'#ffd400');bolt.material.side=THREE.DoubleSide;
  const ctx={
    time:0,dieStart:new THREE.Vector3(3.6,1.05,2.2),dieLanding:new THREE.Vector3(.15,.375,.1),V3:THREE.Vector3,clamp,smooth,easeOut,easeIO:smooth,easeIn,
    elastic:v=>{v=clamp(v);return v===0||v===1?v:1-2**(-10*v)*Math.cos(v*18);},
    backOut:v=>{v=clamp(v)-1;return 1+2.7*v**3+1.7*v*v;},rnd:v=>{const n=Math.sin(v*127.1+311.7)*43758.5453;return n-Math.floor(n);},
    lerpAngle:(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*clamp(t),
    FX,face,up,cell,hopPath,settle,flash:(p,t,col)=>FX.ring(p,t,col,{max:1,life:.4}),
    cue:(name,t)=>{if(active&&active.c>=t&&active.previous<t)audio?.cue?.(name);},
    lookAt:(p,pos)=>({lx:Math.sin(yawTo(p.position,pos)-p.rotation.y),ly:clamp(pos.y-p.position.y)-.3}),
    baseCenter:seat=>{const p=new THREE.Vector3();for(let k=0;k<4;k++)p.add(cell(seat,-1,k));return p.multiplyScalar(.25);},
    camYaw:p=>camera?Math.atan2(camera.position.x-p.x,camera.position.z-p.z):0,yawTo,
    dirTo:(a,b)=>b.clone().sub(a).setY(0).normalize(),perpTo:(a,b)=>{const d=b.clone().sub(a).setY(0).normalize();return new THREE.Vector3(d.z,0,-d.x);},
    pathAt,pathYaw:(path,w)=>{const k=Math.min(path.length-2,Math.max(0,Math.floor(w)));return yawTo(path[k],path[k+1]);},
    cells:(seat,start,n)=>{
      if(active.style==='conga')return [active.path[0].clone(),active.path[0].clone(),...active.path.map(p=>p.clone())];
      if(active.style==='liebre'&&n===active.steps+1){const last=active.path.at(-1),before=active.path.at(-2);return [...active.path.map(p=>p.clone()),last.clone().add(last.clone().sub(before))];}
      return Array.from({length:n+1},(_,k)=>pathAt(active.path,k/n*(active.path.length-1)));
    },
    die:dieProxy,dieSpin,dieFace:{1:[0,0,0],2:[-Math.PI/2,0,0],3:[0,0,Math.PI/2],4:[0,0,-Math.PI/2],5:[Math.PI/2,0,0],6:[Math.PI,0,0]},
    pawns:proxies,colors:COLORS,names:Array.from({length:seats},(_,i)=>String(i+1)),scene:stage,cloud,bump,crowns,
    crown:(m,p,t)=>{if(t<0)return;m.visible=true;m.position.copy(up(p.position,.52));m.rotation.y=ctx.time;},
    tint:(p,col,k)=>{const mat=models[proxies.indexOf(p)]?.children[1]?.material;if(mat)mat.color.set('#ffffff').lerp(new THREE.Color(col),clamp(k));},
    approach:(x,c)=>hopTo(x,c,0,.3,x.A,x.P),
    scared:(x,c,start=.3)=>{x.victim.position.copy(x.V);x.victim.rotation.set(0,x.yawP,0);if(c>start)x.victim.position.x+=Math.sin(ctx.time*40)*.008;face(x.victim,{open:1.3,mouth:'o'});},
    flyHome,dizzyHome:(x,c,t)=>{landPose(x.victim,c,t,x.VB,ctx.camYaw(x.VB));face(x.victim,{open:.6,lx:Math.sin(ctx.time*9),mouth:'o'});},
    hopTo,celebrate:(x,c,t)=>landPose(x.mover,c,t,x.V,x.yawV),landPose,
    homeSlot:(seat,piece)=>active?.seat===seat&&active.group==='home'&&piece===active.piece?active.path.at(-1).clone():actualCell(seat,table.home,piece),
    nextSafe:()=>active.path.length-1,bubble,wall,spot:{intensity:0,position:new THREE.Vector3(),target:{position:new THREE.Vector3()}},hemi:{intensity:2.5},sun:{intensity:3},
    mkTex:(w,h,draw)=>{const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d'),w,h);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;},
    fe:{},xe:{...table,dieX:3.08,radius:3.2},me:seats,Hi,ir,ua,Ei,mallet,bolt,viewCamera:camera||{position:new THREE.Vector3(0,6,6)},
  };
  library=createAuthoredLibrary(ctx);
  Object.assign(library.actions,createCaptureLibrary(ctx));
  function resetProps(){library.reset();for(const p of props)p.visible=false;spring.visible=true;tunnel.visible=true;Hi.visible=false;ua.forEach(p=>p.visible=false);Ei.visible=false;FX.reset();}
  function restoreActual(a){for(let i=0;i<models.length;i++){restore(models[i],a.original[i]);const mat=models[i].children[1]?.material;if(mat&&a.colors[i])mat.color.copy(a.colors[i]);}if(die&&a.diePose)restore(die,a.diePose);}
  function create(style,{mover=models[0],path,partner=null,victim=null,victimTarget=null,victims=[],dieFrom=null,dieTo=null,steps=1,duration=2.4,team=null}={}){
    active?.dispose();
    if(dieFrom)ctx.dieStart.copy(local(dieFrom));if(dieTo)ctx.dieLanding.copy(local(dieTo));
    const index=models.indexOf(mover),seat=mover.userData.seat||0,piece=mover.userData.piece||0,group=animationGroup(style);
    const original=models.map(pose),bases=original.map(b=>({...b,position:local(b.position)}));
    const route=(path||[mover.position,mover.position]).map(local);if(route.length<2)route.push(route[0].clone());
    const other=partner||victim||models.find(p=>p.userData.seat!==seat),rival=proxies[models.indexOf(other)];
    const a={style,group,seat,piece,path:route,original,bases,colors:models.map(p=>p.children[1]?.material?.color.clone()),diePose:die?pose(die):null,
      mover:proxies[index],victim:proxies[models.indexOf(victim)]||rival,rival,rivalSeat:rival?.userData.seat,team:(team||models.filter(p=>p.userData.seat===seat)).map(p=>proxies[models.indexOf(p)]),
      steps,D:duration,J:1,H:.32,sq:.22,col:COLORS[seat],busy:new Set(),c:0,previous:-1e-6,done:false,
      A:route[0].clone(),V:route.at(-1).clone(),VB:victimTarget?local(victimTarget):actualCell(rival?.userData.seat||0,-1,rival?.userData.piece||0),
    };
    a.P=a.V.clone().addScaledVector(ctx.dirTo(a.A,a.V),-.35);a.dir=ctx.dirTo(a.P,a.V);a.yawV=yawTo(a.P,a.V);a.yawP=yawTo(a.V,a.P);
    if(style==='bote'||style==='soplido'){
      character?.dispose();
      character=buildCharacter(normalizeAvatar(avatarFor(seat)));
      const bounds=new THREE.Box3().setFromObject(character.group),height=bounds.max.y-bounds.min.y;
      character.group.scale.setScalar(.8/Math.max(.1,height));character.group.position.y=-bounds.min.y*character.group.scale.y;library.avatar.add(character.group);
    }
    a.sample=(t,time=0,size=1)=>{
      if(a.done||disposed)return;active=a;restoreActual(a);resetProps();ctx.time=time;a.c=clamp(t);a.busy.clear();
      proxies.forEach((p,i)=>{restore(p,bases[i]);p.scale.setScalar(1);});dieProxy.position.copy(a.diePose?local(a.diePose.position):new THREE.Vector3(3.08,.375,0));dieProxy.rotation.set(0,0,0);dieProxy.scale.setScalar(1);
      library.actions[style](a,a.c);
      for(const [k,extra] of victims.slice(1).entries()){
        const index=models.indexOf(extra.model),proxy=proxies[index];a.busy.add(proxy);
        if(a.c>=.55)flyHome({...a,victim:proxy,VB:local(extra.target)},a.c,bases[index].position,.55,.95,{height:1.2+k*.2});
      }
      if(bump.parent&&proxies.includes(bump.parent)){const parent=bump.parent;const pos=bump.position.clone().multiply(parent.scale).applyEuler(parent.rotation).add(parent.position);stage.add(bump);bump.position.copy(pos);}
      a.busy.add(a.mover);if(group==='capture')a.busy.add(a.victim);
      for(const p of a.busy){const i=proxies.indexOf(p);if(i<0)continue;models[i].position.copy(p.position);models[i].position.y+=offset;models[i].rotation.copy(p.rotation);models[i].scale.copy(p.scale).multiplyScalar(i===index?size:original[i].scale.x);models[i].visible=p.visible;}
      if(group==='roll'&&die){die.position.copy(dieProxy.position);die.position.y+=offset;die.quaternion.copy(dieProxy.quaternion).multiply(dieSpin.quaternion);die.scale.copy(dieProxy.scale);}
      if(a.c===0||a.c===1){mover.position.copy(path?.[a.c===0?0:path.length-1]||original[index].position);mover.visible=true;mover.scale.setScalar(size);mover.rotation.set(0,0,0);}
      if(a.c===1){resetProps();for(let i=0;i<models.length;i++)if(i!==index)restore(models[i],original[i]);if(victim&&victimTarget)victim.position.copy(victimTarget);}
      a.previous=a.c;
    };
    a.dispose=()=>{if(a.done)return;a.done=true;restoreActual(a);resetProps();if(active===a)active=null;};active=a;return a;
  }
  function dispose(){if(disposed)return;active?.dispose();disposed=true;character?.dispose();FX.dispose();disposeModel(stage);}
  resetProps();return {create,dispose,get active(){return active;},root:stage};
}
