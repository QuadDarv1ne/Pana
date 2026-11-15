import { DIE_LOOKS, dieLook } from './die-shop.js';
const POINTS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
export function dieSkin(id){
  const hosted=globalThis.PanaDice?.skin?.(id);if(hosted)return hosted;
  const look=dieLook(id),base=look.face?look:DIE_LOOKS[0];
  return {mat:{roughness:base.roughness,clearcoat:1},face(ctx,n,size){
    ctx.save();ctx.scale(size/128,size/128);
    const gradient=ctx.createLinearGradient(0,0,128,128);gradient.addColorStop(0,base.face[0]);gradient.addColorStop(1,base.face[1]);ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    if(base.trim){ctx.strokeStyle=base.trim;ctx.lineWidth=6;ctx.strokeRect(9,9,110,110);}
    ctx.fillStyle=base.pip;for(const [x,y] of POINTS[n]){ctx.beginPath();ctx.arc(64+x*31,64+y*31,10,0,Math.PI*2);ctx.fill();}ctx.restore();
  }};
}
