import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { ludoClients } from './ludo-clients.js';
const {browser,errors,pair,startPlaying,fail}=await ludoClients('ludo-dice');
try {
  const [a,b]=await pair();
  for(const page of [a,b]){
    await page.evaluate(async()=>{const {createMangoWallet}=await import('/engine/mangos.js');createMangoWallet(undefined,{source:'ludo'}).credit(450);dispatchEvent(new StorageEvent('storage',{key:'pana:mangos'}));});
    await page.locator('#change-dice').click();
    await page.waitForFunction(()=>document.querySelectorAll('[data-die]').length===2);
  }
  await a.locator('[data-die="mango"]').click();await a.locator('.dice-detail button').click();
  await b.locator('[data-die="crema"]').click();
  for(const page of [a,b])await page.waitForFunction(()=>ludoDebug.room.state.players[0].dieLook==='mango'&&ludoDebug.room.state.players[1].dieLook==='crema');
  await a.screenshot({path:path.join(os.tmpdir(),'pana-dice-desktop.png')});
  await b.setViewportSize({width:390,height:844});
  assert.equal(await b.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await b.locator('.dice-page').scrollIntoViewIfNeeded();
  await b.screenshot({path:path.join(os.tmpdir(),'pana-dice-mobile.png')});
  await b.keyboard.press('Escape');assert.equal(await b.locator('.pana-menu[open]').count(),0);
  await b.setViewportSize({width:1440,height:1000});
  for(const page of [a,b])await page.locator('.dice-page header button').click();
  await startPlaying(a,b);
  for(const seat of [0,1,0]){
    await a.evaluate(seat=>{const g=ludoDebug.room.game;g.turnPause=null;g.autoMove=null;g.turn=seat;g.revision++;ludoDebug.room.publish();},seat);
    for(const page of [a,b])await page.waitForFunction(look=>ludoDebug.world.die.children[0].userData.look===look,seat?'crema':'mango');
  }
  await a.evaluate(()=>{const g=ludoDebug.room.game;g.turn=1;g.turnPause={seat:0,kind:'move',remaining:10};g.revision++;ludoDebug.room.publish();});
  for(const page of [a,b])await page.waitForFunction(()=>ludoDebug.world.die.children[0].userData.look==='mango');
  // Model generation proves every reference painter, including glow maps.
  await a.evaluate(async()=>{const {createLudoDie}=await import('./board-model.js');const {DIE_LOOKS}=await import('./die-shop.js');for(const look of DIE_LOOKS){const die=createLudoDie({look:look.id});die.userData.dispose();}});
  assert.deepEqual(errors,[]);
  console.log('ok: starter previews, separate purchases, replicated personal dice and turn changes');
} catch(error){await fail(error);} finally{await browser.close();}
