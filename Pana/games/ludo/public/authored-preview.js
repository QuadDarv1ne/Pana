import * as THREE from 'three';
import { createLudoBoard, createLudoPawn, createLudoDie, boardPoint } from './board-model.js';
import { createAuthoredAnimator } from './authored-motion.js';
import { animationGroup } from './animation-catalog.js';
import { ludoTrack } from './rules.js';
import { disposeModel } from '/engine/models/props/game-table.js';

// The previews exercise the same adapter, props and samplers as live matches.
export function createAuthoredPreview({style='patineta',seats=4}={}) {
  const root=new THREE.Group(),pawns=[],group=animationGroup(style),home=ludoTrack(seats).home;
  root.add(createLudoBoard({seats}));
  const at=(seat,progress,piece=0)=>{const [x,z]=boardPoint(seat,progress,piece,seats);return new THREE.Vector3(x,.21,z);};
  for(let seat=0;seat<seats;seat++)for(let piece=0;piece<4;piece++){
    const p=createLudoPawn({seat,number:piece+1});p.userData.seat=seat;p.userData.piece=piece;p.position.copy(at(seat,group==='win'&&seat===0?home:-1,piece));root.add(p);pawns.push(p);
  }
  const mover=pawns[0],rival=pawns[4],yard=rival.position.clone(),steps=style==='tren'?6:['conga','selfie'].includes(style)?4:5;
  const path=group==='entry'?[at(0,-1),at(0,0)]:group==='home'?Array.from({length:5},(_,i)=>at(0,home-4+i)):['move','capture','safe'].includes(group)?Array.from({length:steps+1},(_,i)=>at(0,8+i)):[mover.position.clone(),mover.position.clone()];
  mover.position.copy(path[0]);
  if(['capture','safe','move'].includes(group))rival.position.copy(path.at(-1));
  if(group==='home')for(let k=1;k<4;k++)pawns[k].position.copy(at(0,home,k));
  const die=new THREE.Group(),body=createLudoDie();body.position.y=-.215;die.add(body);die.position.set(3.08,.375,0);root.add(die);
  const animator=createAuthoredAnimator({root,pawns,seats,die,baseY:.21});
  const motion=animator.create(style,{mover,path,partner:rival,victim:group==='capture'?rival:null,victimTarget:yard,steps,duration:3.2});
  root.userData.tick=time=>motion.sample(Math.min(1,(time%4)/3.2),time);
  root.userData.tick(0);root.userData.previewBounds=[[-4,0,-4],[4,4.5,4]];
  root.userData.dispose=()=>{animator.dispose();disposeModel(root);};return root;
}
