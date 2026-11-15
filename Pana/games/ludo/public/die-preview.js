import { dieSkin } from './die-appearance.js';
export function diePreview(id){
  const preview=document.createElement('span');preview.className='dice-preview';preview.setAttribute('aria-hidden','true');
  for(const [i,n] of [1,3,2].entries()){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;dieSkin(id).face(canvas.getContext('2d'),n,256);
    const face=document.createElement('img');face.src=canvas.toDataURL();face.alt='';face.className=`dice-face dice-face-${i}`;preview.append(face);
  }
  return preview;
}
