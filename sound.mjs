// Short mechanical cues synthesized at interaction time. All voices share a gain bus.
let enabled = true;
try { enabled = localStorage.getItem("relay-shift-sound") !== "off"; } catch {}
let context, master;

export function soundEnabled() { return enabled; }
export function toggleSound() {
  enabled = !enabled;
  try { localStorage.setItem("relay-shift-sound",enabled ? "on" : "off"); } catch {}
  if (master) master.gain.setTargetAtTime(enabled ? .27 : 0,context.currentTime,.012);
  if (enabled) play("on");
}

const scores = {
  left: [["triangle",220,135,0,.075,.45],["square",590,410,.052,.026,.095]],
  right: [["triangle",185,285,0,.075,.44],["square",620,430,.052,.026,.095]],
  dispatch: [["sine",105,190,0,.14,.53],["triangle",370,480,.075,.1,.26]],
  turn: [["triangle",178,270,0,.095,.42],["sine",365,530,.065,.13,.39]],
  blocked: [["triangle",145,96,0,.10,.51],["triangle",132,87,.13,.12,.42]],
  failed: [["triangle",230,182,0,.14,.46],["triangle",162,100,.15,.24,.45]],
  complete: [["sine",392,392,0,.15,.50],["triangle",494,494,.12,.15,.31],["sine",587,587,.23,.25,.54]],
  on: [["sine",330,460,0,.09,.42]],
};
export function play(cue) {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!enabled || !Audio) return;
  try {
    if (!context) {
      context=new Audio(); master=context.createGain();
      master.gain.value=.27; master.connect(context.destination);
    }
    if (context.state !== "running") context.resume().catch(()=>{});
    const now=context.currentTime+.008;
    for (const [type,from,to,offset,length,amplitude] of scores[cue]) {
      const osc=context.createOscillator(), envelope=context.createGain();
      const t=now+offset;
      osc.type=type; osc.frequency.setValueAtTime(from,t);
      osc.frequency.exponentialRampToValueAtTime(to,t+length);
      envelope.gain.setValueAtTime(.0001,t);
      envelope.gain.exponentialRampToValueAtTime(amplitude,t+.008);
      envelope.gain.exponentialRampToValueAtTime(.0001,t+length);
      osc.connect(envelope); envelope.connect(master);
      osc.onended=()=>{osc.disconnect();envelope.disconnect()};
      osc.start(t); osc.stop(t+length+.006);
    }
  } catch { /* Unavailable audio output leaves all controls operational. */ }
}

