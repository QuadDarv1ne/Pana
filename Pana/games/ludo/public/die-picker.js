import { dieLooks } from './die-shop.js';
import { diePreview } from './die-preview.js';
import { createDieShowroom } from './die-showroom.js';
import { loc } from '/engine/i18n.js';
import { icon } from '/engine/icons.js';

export function createDiePicker(node,{shop,wallet,change}){
  const make=(tag,cls,text)=>{const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;};
  const button=make('button','pk-btn',loc('Cambiar dado'));button.id='change-dice';button.type='button';
  document.getElementById('pana-lobby-change').after(button);
  const page=make('section','dice-page');page.hidden=true;page.setAttribute('aria-labelledby','dice-title');
  const head=make('header','dice-header'),title=make('h1','',loc('Dados'));title.id='dice-title';
  const back=make('button','pk-btn',loc('Volver'));back.type='button';
  const balance=make('span','dice-balance');head.append(back,title,balance);
  const stage=make('div','dice-stage'),canvas=make('canvas','dice-canvas');canvas.setAttribute('aria-label',loc('Dado en 3D'));
  const detail=make('div','dice-detail'),name=make('h2',''),action=make('button','pk-btn pk-btn--primary'),error=make('p','dice-error');action.type='button';error.setAttribute('role','status');
  detail.append(name,action,error);stage.append(canvas,detail);
  const toolbar=make('div','dice-toolbar'),search=make('input','');search.type='search';search.placeholder=loc('Buscar dado');search.setAttribute('aria-label',loc('Buscar dado'));
  const filter=make('button','pk-btn',loc('Mis dados'));filter.type='button';filter.setAttribute('aria-pressed','false');
  const count=make('span','dice-count');toolbar.append(search,filter,count);
  const grid=make('div','dice-grid');page.append(head,stage,toolbar,grid);node.replaceWith(page);
  const showroom=createDieShowroom(canvas);
  let mine=false,busy=false,selected=shop.equipped(),openedHere=false;
  const cards=dieLooks().map(look=>{
    const card=make('button','dice-choice');card.type='button';card.dataset.die=look.id;
    const label=make('strong','',loc(look.name)),status=make('span','dice-status');card.append(diePreview(look.id),label,status);grid.append(card);
    card.onclick=()=>{selected=look.id;history.replaceState(null,'',url(selected));render();};
    return {look,card,status};
  });
  const url=id=>location.pathname+location.search+'#dados='+encodeURIComponent(id);
  function render(){
    balance.replaceChildren(icon('mango'),document.createTextNode(String(wallet.peek())));
    let visible=0;
    for(const {look,card,status} of cards){
      const owned=shop.owns(look.id),equipped=shop.equipped()===look.id;
      card.hidden=(mine&&!owned)||!loc(look.name).toLocaleLowerCase().includes(search.value.toLocaleLowerCase());if(!card.hidden)visible++;
      card.setAttribute('aria-pressed',String(selected===look.id));
      status.replaceChildren(document.createTextNode(equipped?loc('Elegido'):owned?loc('Tuyo'):String(look.cost)));
      if(!owned)status.append(icon('mango'));
      card.setAttribute('aria-label',loc('{name} · {status}',{name:loc(look.name),status:status.textContent}));
    }
    const look=dieLooks().find(x=>x.id===selected)||dieLooks()[0];selected=look.id;
    name.textContent=loc(look.name);showroom.show(selected);
    const owned=shop.owns(selected),equipped=shop.equipped()===selected;
    action.textContent=equipped?loc('Elegido'):owned?loc('Usar'):globalThis.PanaDice?.storeUrl?loc('Ver en tienda'):loc('Comprar');
    action.disabled=busy||equipped||(!owned&&!globalThis.PanaDice?.storeUrl&&wallet.peek()<look.cost);
    count.textContent=loc('{n} dados',{n:visible});
  }
  action.onclick=async()=>{
    if(busy)return;
    if(!shop.owns(selected)&&globalThis.PanaDice?.storeUrl){location.assign(globalThis.PanaDice.storeUrl(selected,url(selected)));return;}
    busy=true;error.textContent='';render();
    try{const ok=await (shop.owns(selected)?shop.equip(selected):shop.buy(selected));if(ok)change(shop.equipped());}
    catch(e){error.textContent=e.message;}finally{busy=false;render();}
  };
  async function refresh(){try{await globalThis.PanaDice?.refresh?.();change(shop.equipped());}catch(e){error.textContent=e.message;}render();}
  function route(){
    const open=location.hash.startsWith('#dados');
    page.hidden=!open;document.body.classList.toggle('viewing-dice',open);showroom.active(open);
    if(open){const id=decodeURIComponent(location.hash.split('=')[1]||'');selected=dieLooks().some(x=>x.id===id)?id:shop.equipped();render();refresh();back.focus();}
    else if(openedHere){openedHere=false;button.focus();}
  }
  function close(){if(page.hidden)return;history.replaceState(null,'',location.pathname+location.search);route();}
  button.onclick=()=>{openedHere=true;history.pushState(null,'',url(shop.equipped()));route();};
  back.onclick=()=>{if(openedHere)history.back();else close();};
  search.oninput=render;filter.onclick=()=>{mine=!mine;filter.setAttribute('aria-pressed',String(mine));render();};
  const focus=()=>{if(!page.hidden)refresh();};window.addEventListener('focus',focus);window.addEventListener('hashchange',route);window.addEventListener('popstate',route);
  render();route();const stop=wallet.onChange(render);wallet.ready.then(render);
  return {render,close,dispose(){stop();showroom.dispose();window.removeEventListener('focus',focus);window.removeEventListener('hashchange',route);window.removeEventListener('popstate',route);document.body.classList.remove('viewing-dice');page.remove();button.remove();}};
}
