import assert from 'node:assert/strict';
import { launch, openGame } from '../../../tests/browser-kit.js';

const browser=await launch(),room=`ludo-authored-${Date.now()}`;
try {
  const page=await openGame(browser,'ludo',{room,query:'debug',name:'Juan'});
  const result=await page.evaluate(async()=>{
    const THREE=await import('three');
    const {createLudoPawn,boardPoint}=await import('/g/ludo/board-model.js');
    const {createAuthoredAnimator}=await import('/g/ludo/authored-motion.js');
    const {ANIMATION_GROUPS}=await import('/g/ludo/animation-catalog.js');
    const {disposeModel}=await import('/engine/models/props/game-table.js');
    const failures=[];let count=0;
    for(const seats of [4,5,6]){
      const root=new THREE.Group(),pawns=[];
      for(let seat=0;seat<seats;seat++)for(let piece=0;piece<4;piece++){
        const p=createLudoPawn({seat,number:piece+1});p.userData.seat=seat;p.userData.piece=piece;
        const [x,z]=boardPoint(seat,-1,piece,seats);p.position.set(x,1.67,z);pawns.push(p);root.add(p);
      }
      const animator=createAuthoredAnimator({root,pawns,seats});
      root.traverse(p=>{if(p.geometry?.attributes.position&&!p.geometry.attributes.position.array.every(Number.isFinite))throw Error('invalid prop geometry');});
      for(const [group,styles] of Object.entries(ANIMATION_GROUPS))for(const style of styles){
        const seat=seats-1,mover=pawns[seat*4],victim=pawns[0],original=victim.position.clone();
        const path=Array.from({length:6},(_,i)=>{const [x,z]=boardPoint(seat,8+i,0,seats);return new THREE.Vector3(x,1.67,z);});path[5].x+=.075;
        let motion;
        try{
          motion=animator.create(style,{mover,path,partner:victim,victim:group==='capture'?victim:null,victimTarget:original,steps:5});
          for(const t of [0,.05,.15,.27,.39,.49,.57,.65,.73,.81,.9,.98,.4,1]){
            motion.sample(t,t*3,.9);
            for(const p of pawns)if(![...p.position,...p.scale,p.rotation.x,p.rotation.y,p.rotation.z].every(Number.isFinite))throw Error('invalid pawn pose');
            root.traverse(p=>{if(![...p.position,...p.scale,p.rotation.x,p.rotation.y,p.rotation.z].every(Number.isFinite))throw Error(`invalid prop ${p.type} at ${t}: ${[...p.position,...p.scale,p.rotation.x,p.rotation.y,p.rotation.z]}`);});
          }
          if(mover.position.distanceTo(path[5])>1e-8||!mover.visible)throw Error('endpoint');
          motion.sample(.5);motion.dispose();motion.dispose();
          if(victim.position.distanceTo(original)>1e-8||!pawns.every(p=>p.visible))throw Error('cleanup');
          count++;
        }catch(e){failures.push(`${seats}/${style}: ${e.message}`);motion?.dispose();break;}
      }
      animator.dispose();disposeModel(root);
    }
    return {failures,count};
  });
  assert.deepEqual(result.failures,[]);assert.equal(result.count,258);assert.deepEqual(page.errors,[]);
  const guest=await openGame(browser,'ludo',{room,query:'debug',name:'Ana'});
  await page.waitForFunction(()=>ludoDebug.room.members.size===2);
  // A real missed roll must retain its queued reaction through the animated
  // throw, and both clients must choose the same scene from the roll snapshot.
  await page.evaluate(()=>{
    const g=ludoDebug.room.game;g.round++;g.phase='playing';g.turn=0;g.die=0;g.rng=1;g.sixes=0;g.autoMove=g.turnPause=null;g.options.assistedEntry=false;
    g.players.forEach(p=>p.pieces=[-1,-1,-1,-1]);g.revision++;ludoDebug.room.publish();
  });
  await guest.waitForFunction(()=>ludoDebug.room.state.phase==='playing'&&ludoDebug.room.state.rng===1);
  await page.evaluate(()=>ludoDebug.room.action('roll',{power:.5}));
  for(const client of [page,guest])await client.waitForFunction(()=>ludoDebug.world.reactions.history.length>0,null,{timeout:60000});
  const reactions=await Promise.all([page,guest].map(p=>p.evaluate(()=>ludoDebug.world.reactions.history.at(-1))));
  assert.equal(reactions[0],reactions[1]);assert.ok(['huelga','bostezo','cartas','empujon','telarana','reclamo'].includes(reactions[0]));
  // A stacked capture animates every victim and restores all real yard slots.
  await page.evaluate(()=>{
    const g=ludoDebug.room.game;g.round++;g.turn=0;g.die=4;g.autoMove=g.turnPause=null;
    g.players.forEach(p=>p.pieces=[-1,-1,-1,-1]);g.players[0].pieces[0]=14;g.players[1].pieces=[5,5,-1,-1];g.revision++;ludoDebug.room.publish();
  });
  await guest.waitForFunction(()=>ludoDebug.room.state.players[1].pieces[1]===5);
  await page.evaluate(()=>ludoDebug.room.action('move',{piece:0}));
  for(const client of [page,guest])await client.waitForFunction(()=>ludoDebug.world.pawns[0].progress===18&&!ludoDebug.world.moving&&ludoDebug.world.pawns.slice(4,6).every(p=>p.progress===-1&&p.model.visible&&p.model.position.distanceTo(p.target)<.001),null,{timeout:60000});
  const captures=await Promise.all([page,guest].map(p=>p.evaluate(()=>ludoDebug.world.pawns[0].lastMotion)));
  assert.equal(captures[0],captures[1]);assert.deepEqual(page.errors,[]);assert.deepEqual(guest.errors,[]);
  // A newer board snapshot can interrupt a capture before its sampler ends.
  // Its victims must not retain a returning-home marker forever.
  await page.evaluate(()=>{
    const g=ludoDebug.room.game;g.round++;g.turn=0;g.die=4;g.autoMove=g.turnPause=null;
    g.players[0].pieces=[14,-1,-1,-1];g.players[1].pieces=[5,5,-1,-1];g.revision++;ludoDebug.room.publish();
  });
  await guest.waitForFunction(()=>ludoDebug.room.state.players[1].pieces[1]===5);
  await page.evaluate(()=>{
    ludoDebug.room.action('move',{piece:0});
    const g=ludoDebug.room.game;g.turnPause=null;g.players[2].pieces[0]=1;g.revision++;ludoDebug.room.publish();
  });
  for(const client of [page,guest])await client.waitForFunction(()=>ludoDebug.room.state.players[2].pieces[0]===1&&ludoDebug.world.pawns.slice(4,6).every(p=>!p.flight&&p.model.visible&&p.model.position.distanceTo(p.target)<.001),null,{timeout:60000});
  console.log(`ok: ${result.count} authored animation samples, endpoints and cleanup`);
}finally{await browser.close();}
