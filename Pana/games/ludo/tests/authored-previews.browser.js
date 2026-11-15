import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launch, base } from '../../../tests/browser-kit.js';

const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/studio/assets/ludo-patineta`);
  await page.waitForFunction(()=>window.panaLibrary?.current&&document.querySelector('#preview-status').hidden,null,{timeout:90000});
  const result=await page.evaluate(async()=>{
    const THREE=await import('three');
    const {createAuthoredPreview}=await import('/g/ludo/authored-preview.js');
    const {ANIMATION_NAMES}=await import('/g/ludo/animation-catalog.js');
    const {ASSETS}=await import('/studio/catalog.js');
    const scene=new THREE.Scene();scene.background=new THREE.Color('#ead9bc');
    scene.add(new THREE.HemisphereLight('#ffffff','#66523a',2.5));
    const light=new THREE.DirectionalLight('#fff4df',3);light.position.set(3,7,4);scene.add(light);
    const renderer=panaLibrary.renderer,size=renderer.getSize(new THREE.Vector2());
    const camera=new THREE.PerspectiveCamera(40,size.x/size.y,.1,50);camera.position.set(4.5,6.7,7);camera.lookAt(0,.45,0);
    const shots={},failures=[];let count=0;
    for(const style of Object.keys(ANIMATION_NAMES)){
      let root;
      try{
        if(!ASSETS.some(a=>a.id===`ludo-${style}`))throw Error('missing Studio registration');
        root=createAuthoredPreview({style});scene.add(root);root.userData.tick(1.76);renderer.render(scene,camera);
        if(['abduccion','patineta','globos','huelga','pastel','bote'].includes(style))shots[style]=renderer.domElement.toDataURL('image/png');
        count++;
      }catch(e){failures.push(`${style}: ${e.message}`);}finally{root?.userData.dispose();root?.removeFromParent();}
    }
    return {count,failures,shots};
  });
  await mkdir('art/ludo',{recursive:true});
  for(const [style,data] of Object.entries(result.shots))await writeFile(`art/ludo/authored-${style}.png`,Buffer.from(data.split(',')[1],'base64'));
  assert.deepEqual(result.failures,[]);assert.deepEqual(errors,[]);assert.equal(result.count,86);
  console.log('ok: all 86 Studio registrations build and render their live animation');
}finally{await browser.close();}
