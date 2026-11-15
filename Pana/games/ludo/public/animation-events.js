import { REACTION_DURATION } from './dice-timing.js';
import { chooseAnimation, animationGroup } from './animation-catalog.js';
import { ringIndex, trackOf } from './rules.js';

// Reactions are tied to a revision and cancelled by the next action. Late join
// and initial snapshots establish a baseline without replaying old events.
export function createAnimationEvents({pawns,animator}) {
  let previous=null,state=null,pending=null,active=null,idle=0;
  const history=[];
  function stop(){active?.motion.dispose();active=null;pending=null;idle=0;}
  function queue(group,seat,piece=0,partner=null){pending={group,seat,piece,partner,style:chooseAnimation(group,state,seat,piece)};}
  function update(next){
    const key=JSON.stringify([next.round,next.phase,next.turn,next.rng,next.players.map(p=>p.pieces)]);
    if(previous&&key!==previous.key)stop();
    state=next;
    if(previous&&next.round===previous.round){
      if(next.rng!==previous.rng&&next.lastDie&&!next.die){
        const seat=next.toss.seat;
        if(previous.sixes===2&&next.lastDie===6&&next.options.threeSixes)queue('penalty',seat);
        else if(next.players[seat].pieces.every(p=>p<0))queue('yard',seat);
      }
      if(next.phase==='finished'&&previous.phase!=='finished')queue('win',next.winner);
    }
    state=next;previous={key,round:next.round,revision:next.revision,rng:next.rng,sixes:next.sixes,phase:next.phase};
  }
  function land(p){
    if(!state||state.phase==='finished'||pending||animationGroup(p.lastMotion)==='safe')return;
    const {seats,lap,safe}=trackOf(state),progress=p.progress;
    if(progress<0||progress>lap||!safe.includes(ringIndex(p.seat,progress,seats)))return;
    const rival=pawns.find(q=>q.seat!==p.seat&&q.progress>=0&&q.progress<=lap&&ringIndex(q.seat,q.progress,seats)===ringIndex(p.seat,progress,seats));
    if(rival)queue('safe',p.seat,p.piece,rival.model);
  }
  function frame(dt,tossing,moving){
    if(!state)return;
    if(!pending&&!active&&!tossing&&!moving&&state.phase==='playing'&&!state.die){idle+=dt;if(idle>=10){queue('idle',state.turn);idle=-60;}}
    if(pending&&!tossing&&!moving){
      const e=pending;pending=null;const p=pawns.find(p=>p.seat===e.seat&&p.piece===e.piece);
      const style=e.style;
      const motion=animator().create(style,{mover:p.model,partner:e.partner,steps:state.lastDie||1,duration:REACTION_DURATION});
      active={motion,started:performance.now(),time:0};history.push(style);if(history.length>32)history.shift();
    }
    if(active){const a=active;a.time=Math.max(a.time+dt,(performance.now()-a.started)/1000);a.motion.sample(Math.min(1,a.time/REACTION_DURATION),a.time);if(a.time>=REACTION_DURATION){a.motion.dispose();active=null;}}
  }
  return {update,land,frame,stop,history,get active(){return !!active;},get celebrating(){return pending?.group==='win'||active?.motion.group==='win';}};
}
