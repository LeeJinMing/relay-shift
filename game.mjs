import { LEVELS, begin, shift, advance } from "./routes.mjs";
import { play, soundEnabled, toggleSound } from "./sound.mjs";

const $ = id => document.getElementById(id);
const desk=$("machine"), tracks=$("tracks"), guide=$("guide");
const routes=[
  {art:"depot", brief:"Cross three belts at the loading depot. Each shift costs one move."},
  {art:"junction", brief:"Follow the canal junction’s side gates. An arrow changes the cart’s next lane."},
  {art:"terminal", brief:"Deliver after dark. Plan ahead across five belts with six shifts."},
];
const symbols={".":"↓",l:"←",r:"→"};
const meanings={"#":"barrier",".":"open gate",l:"left gate",r:"right gate"};
const sessions=LEVELS.map(begin);
const completed=new Set();
const motion=matchMedia("(prefers-reduced-motion: reduce)");
let index=0, state=sessions[0], feedback=null, touch=null;
const pad=n=>String(n).padStart(2,"0");
const done=()=>state.row===state.grid.length;
const current=()=>state.grid[state.row]?.[state.lane];
const stuck=()=>!done() && current()==="#" && state.moves===0;
function node(tag,text,cls) {
  const el=document.createElement(tag);
  if(text!==undefined) el.textContent=text;
  if(cls) el.className=cls;
  return el;
}
const tabs=LEVELS.map((level,i)=>{
  const btn=node("button");btn.type="button";
  btn.append(node("b",pad(i+1)),node("span",level.name));
  btn.addEventListener("click",()=>open(i));return btn;
});
$("routes").append(...tabs);
function focusDesk(){desk.focus({preventScroll:true})}

function open(i,reset=false) {
  index=i;
  if(reset) sessions[i]=begin(LEVELS[i]);
  state=sessions[i];feedback=null;touch=null;
  $("route-number").textContent="Route "+pad(i+1)+" / 03";
  $("art").src="./assets/"+routes[i].art+".webp";
  $("route-name").textContent=state.level.name;$("brief").textContent=routes[i].brief;
  $("cart").style.transition="none";
  render();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{$("cart").style.transition=""}));
}
function store(next) {state=next;sessions[index]=next}
function rotate(dir) {
  const next=shift(state,dir);
  if(next===state)return;
  store(next);feedback=null;render(dir);play(stuck()?"failed":dir<0?"left":"right");
}
function dispatch() {
  if(done() || stuck())return;
  const tile=current(), next=advance(state);
  if(next===state) {feedback="blocked";render();play("blocked");return}
  store(next);feedback=null;
  if(done())completed.add(index);
  render();play(done()?"complete":stuck()?"failed":tile==="."?"dispatch":"turn");
}
function status() {
  if(done())return ["success",index===2?"Night freight delivered":"Delivery complete",
    "Crossed "+state.grid.length+" belts with "+state.moves+" shift"+(state.moves===1?"":"s")+" to spare."];
  if(stuck())return ["failed","Out of shifts","The cart faces a barrier in lane "+(state.lane+1)+". Restart for a fresh shift budget."];
  const tile=current();
  if(tile!=="#"){
    const landing=advance(state).lane+1;
    const detail=state.row+1===state.grid.length?"Dispatch through the final gate to the receiving dock.":
      tile==="."?"Dispatch to the next belt in lane "+landing+".":"Dispatch through the arrow to enter lane "+landing+" on the next belt.";
    return ["ready","Gate aligned",detail];
  }
  if(index===0 && state.row===0 && state.moves===4)
    return [feedback||"idle",feedback?"Blocked in lane 3":"Line up the first gate","Shift left once to put the open gate under the cart."];
  return [feedback||"idle",feedback?"Dispatch blocked":"Find an open gate","Rotate belt "+(state.row+1)+" until a gate lines up with the cart in lane "+(state.lane+1)+"."];
}
function drawBelt(belt,row) {
  const active=row===state.row;
  const line=node("div",undefined,"belt"+(active?" active":row<state.row?" cleared":""));
  line.setAttribute("role","group");
  line.setAttribute("aria-label","Belt "+(row+1)+(active?", active":row<state.row?", cleared":""));
  const rowNo=node("span",pad(row+1),"row-no");rowNo.setAttribute("aria-hidden","true");
  const slot=node("div",undefined,"slot"), tiles=node("div",undefined,"tiles");
  for(const [lane,type] of [...belt].entries()){
    const under=active && lane===state.lane;
    const tile=node("span",undefined,"tile "+(type==="#"?"block":"gate "+type)+(under?" under":""));
    tile.setAttribute("role","img");
    tile.setAttribute("aria-label","Lane "+(lane+1)+", "+meanings[type]+(under?", cart":""));
    tile.dataset.lane=lane;
    if(type!=="#")tile.append(node("b",symbols[type]));
    tiles.append(tile);
  }
  slot.append(tiles);line.append(rowNo,slot);
  return line;
}
function animateShift(direction) {
  if(motion.matches)return;
  const strip=tracks.querySelector(".active .tiles");
  if(!strip)return;
  const clone=(direction===1?strip.firstElementChild:strip.lastElementChild).cloneNode(true);
  clone.classList.remove("under");clone.setAttribute("aria-hidden","true");
  Object.assign(clone.style,{position:"absolute",top:"0",left:direction===1?"100%":"-16.6667%",width:"calc(100% / 6 - 2px)"});
  strip.append(clone);
  const slide=strip.animate([{transform:"translateX("+(-direction*100/6)+"%)"},{transform:"translateX(0)"}],
                             {duration:165,easing:"cubic-bezier(.2,.65,.28,1)"});
  slide.onfinish=()=>clone.remove();
}
function placeCart() {
  const slot=tracks.querySelector(".active .slot")||tracks.querySelector(".slot");
  if(!slot)return;
  const rect=slot.getBoundingClientRect(), base=desk.getBoundingClientRect();
  const x=rect.left-base.left-desk.clientLeft+rect.width*(state.lane+.5)/6;
  const top=done()?$("dock").getBoundingClientRect().bottom-1:rect.top;
  const cart=$("cart");cart.style.left=x+"px";cart.style.top=top-base.top-desk.clientTop+"px";cart.style.visibility="visible";
}
function render(dir=0) {
  $("moves").textContent=state.moves;
  $("belt-count").textContent=done()?"All belts crossed":"Belt "+pad(state.row+1)+" of "+pad(state.grid.length);
  tabs.forEach((btn,i)=>{
    if(i===index)btn.setAttribute("aria-current","step");else btn.removeAttribute("aria-current");
    btn.firstChild.textContent=completed.has(i)?"✓":pad(i+1);
    btn.setAttribute("aria-label","Route "+(i+1)+", "+LEVELS[i].name+(completed.has(i)?", delivered":""));
  });
  $("stamps").replaceChildren(...state.grid.map((_,i)=>{
    const el=node("li",i<state.row?"✓":i+1,"stamp "+(i<state.row?"delivered":i===state.row?"current":""));
    el.setAttribute("aria-label","Belt "+(i+1)+(i<state.row?" complete":i===state.row?" active":" waiting"));return el;
  }));
  $("lanes").replaceChildren(...Array.from(state.grid[0],(_,i)=>node("span",pad(i+1),i===state.lane?"here":"")));
  tracks.replaceChildren(...state.grid.map(drawBelt));
  const [mode,title,detail]=status();
  $("readout").dataset.mode=mode;$("status").textContent=title;$("detail").textContent=detail;
  $("left").disabled=$("right").disabled=done()||!state.moves;
  $("advance").hidden=done()||stuck();
  $("next").hidden=!done()||index===2;
  $("retry").hidden=!stuck()&&!(done()&&index===2);
  $("retry").firstChild.textContent=done()?"Replay route ":"Try again ";
  placeCart();if(dir)animateShift(dir);
}
// On a compact viewport a changing message can scroll the control into view.
// Chrome can then omit the compatibility click after a valid finger tap.
function bindControl(button, action) {
  let start=null;
  function activate(){action();focusDesk()}
  button.addEventListener("touchstart",e=>{
    start=e.touches.length===1?e.changedTouches[0]:null;
  },{passive:true});
  button.addEventListener("touchcancel",()=>{start=null});
  button.addEventListener("touchend",e=>{
    const first=start, last=e.changedTouches[0];start=null;
    if(!first||first.identifier!==last.identifier||!e.cancelable)return;
    const box=button.getBoundingClientRect();
    if(last.clientX<box.left||last.clientX>box.right||last.clientY<box.top||last.clientY>box.bottom)return;
    if(Math.hypot(last.clientX-first.clientX,last.clientY-first.clientY)>12)return;
    e.preventDefault();
    activate();
  },{passive:false});
  button.addEventListener("click",activate);
}
for(const [id,fn] of [["left",()=>rotate(-1)],["right",()=>rotate(1)],["advance",dispatch],
                       ["next",()=>open(index+1)],["retry",()=>open(index,true)],["restart",()=>open(index,true)]]){
  bindControl($(id),fn);
}
$("help").addEventListener("click",()=>guide.showModal());
function renderSound(){
  $("sound").textContent=soundEnabled()?"Sound on":"Sound off";
  $("sound").setAttribute("aria-pressed",String(soundEnabled()));
}
$("sound").addEventListener("click",()=>{toggleSound();renderSound()});
document.addEventListener("keydown",event=>{
  if(guide.open||event.ctrlKey||event.altKey||event.metaKey||event.repeat||event.isComposing)return;
  const key=event.key, deskFocus=event.target===document.body||event.target===desk;
  if(key==="ArrowLeft"||key==="ArrowRight"){event.preventDefault();rotate(key==="ArrowLeft"?-1:1);focusDesk()}
  else if(key==="Enter" && deskFocus){event.preventDefault();if(done()&&index<2)open(index+1);else if(stuck()||done())open(index,true);else dispatch();focusDesk()}
  else if(key.toLowerCase()==="r"){event.preventDefault();open(index,true);focusDesk()}
});
desk.addEventListener("pointerdown",e=>{
  const slot=e.target.closest(".belt.active .slot");
  if(!slot||!e.isPrimary||e.button!==0)return;
  touch={id:e.pointerId,x:e.clientX,y:e.clientY,box:slot.getBoundingClientRect(),row:state.row};
  desk.setPointerCapture(e.pointerId);
});
desk.addEventListener("pointercancel",()=>{touch=null});
desk.addEventListener("pointerup",e=>{
  if(!touch||touch.id!==e.pointerId)return;
  const start=touch;touch=null;
  if(state.row!==start.row)return;
  const dx=e.clientX-start.x,dy=e.clientY-start.y;
  if(Math.abs(dx)>22&&Math.abs(dx)>Math.abs(dy)*1.2)rotate(Math.sign(dx));
  else if(Math.abs(dx)<9&&Math.abs(dy)<9&&Math.floor((start.x-start.box.left)/start.box.width*6)===state.lane)dispatch();
  focusDesk();
});
new ResizeObserver(placeCart).observe(desk);
renderSound();open(0);

