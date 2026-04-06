const {useState,useEffect,useCallback,useRef}=React;

/* ═══════════════════════════════════════
   AUDIO ENGINE — SFX + 8-bit Chiptune BGM
   ═══════════════════════════════════════ */
const AC=window.AudioContext||window.webkitAudioContext;
var ctx=null;
var masterGain=null;
var sfxGain=null;
var bgmGain=null;
var bgmPlaying=false;
var bgmNodes=[];
var currentBGM=null;
var sfxVol=0.5;
var bgmVol=0.3;
var audioMuted=false;

function ea(){
  if(!ctx){
    ctx=new AC();
    masterGain=ctx.createGain();masterGain.connect(ctx.destination);
    sfxGain=ctx.createGain();sfxGain.gain.value=sfxVol;sfxGain.connect(masterGain);
    bgmGain=ctx.createGain();bgmGain.gain.value=bgmVol;bgmGain.connect(masterGain);
  }
  if(ctx.state==='suspended')ctx.resume();
}
function setSfxVol(v){sfxVol=v;if(sfxGain)sfxGain.gain.value=audioMuted?0:v}
function setBgmVol(v){bgmVol=v;if(bgmGain)bgmGain.gain.value=audioMuted?0:v;if(bgmAudio){bgmAudio.volume=audioMuted?0:v;if(v===0)bgmAudio.pause();else if(!audioMuted)bgmAudio.play().catch(()=>{})}}
function toggleMute(){audioMuted=!audioMuted;if(sfxGain)sfxGain.gain.value=audioMuted?0:sfxVol;if(bgmGain)bgmGain.gain.value=audioMuted?0:bgmVol;if(bgmAudio){bgmAudio.volume=audioMuted?0:bgmVol;if(audioMuted)bgmAudio.pause();else bgmAudio.play().catch(()=>{})}return audioMuted}

function tone(f,d=.1,t='square',v=.15){
  try{ea();const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=t;o.frequency.value=f;g.gain.value=v;
  g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d);
  o.connect(g);g.connect(sfxGain);o.start();o.stop(ctx.currentTime+d)}catch(e){}
}

// ── Enhanced SFX ──
function sfx(n){
  switch(n){
    case'click':tone(800,.05);tone(1200,.03,'square',.06);break;
    case'success':tone(523,.12);setTimeout(()=>tone(659,.12),100);setTimeout(()=>tone(784,.18),200);break;
    case'fail':tone(250,.2,'sawtooth',.12);setTimeout(()=>tone(180,.25,'sawtooth',.1),120);break;
    case'levelup':
      [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.12,'square',.1),i*130));
      setTimeout(()=>[1047,1175,1319].forEach((f,i)=>setTimeout(()=>tone(f,.08,'square',.06),i*60)),520);
      break;
    case'coin':tone(988,.05);setTimeout(()=>tone(1319,.08),50);setTimeout(()=>tone(1568,.06,'square',.08),100);break;
    case'lift':
      // Grunt + strain
      tone(100,.4,'sawtooth',.06);tone(120,.3,'sawtooth',.05);
      setTimeout(()=>tone(140,.2,'sawtooth',.04),200);break;
    case'slam':
      // Heavy barbell drop
      tone(60,.2,'sawtooth',.15);tone(45,.15,'sawtooth',.12);
      setTimeout(()=>{tone(80,.08,'square',.06);tone(100,.06,'square',.04)},100);break;
    case'cheer':
      for(let i=0;i<8;i++)setTimeout(()=>{
        tone(400+Math.random()*600,.06,'square',.03);
        if(i%2===0)tone(300+Math.random()*200,.04,'sawtooth',.02);
      },i*60);break;
    case'medal':
      // Triumphant fanfare
      [[523,200],[0,100],[659,200],[0,100],[784,200],[0,100],[1047,400]].reduce((t,[f,d])=>{
        if(f)setTimeout(()=>tone(f,d/1000*1.2,'square',.12),t);
        return t+d;
      },0);break;
    case'tap':tone(660,.03);tone(880,.02,'square',.05);break;
    case'phase':tone(440,.06);setTimeout(()=>tone(660,.08),60);setTimeout(()=>tone(550,.04,'square',.05),120);break;
    case'perfect':
      tone(784,.1);setTimeout(()=>tone(988,.1),80);setTimeout(()=>tone(1175,.15),160);
      setTimeout(()=>{tone(1568,.08,'square',.06);tone(1319,.06,'square',.04)},240);break;
    case'train':
      // Weight clinking
      tone(200,.05,'sawtooth',.08);setTimeout(()=>tone(350,.04,'square',.06),60);
      setTimeout(()=>tone(250,.05,'sawtooth',.07),120);break;
    case'rest':
      // Peaceful
      tone(392,.3,'sine',.08);setTimeout(()=>tone(330,.3,'sine',.06),300);
      setTimeout(()=>tone(294,.4,'sine',.05),600);break;
    case'hurt':
      tone(200,.15,'sawtooth',.1);setTimeout(()=>tone(150,.2,'sawtooth',.08),100);
      setTimeout(()=>tone(100,.25,'sawtooth',.06),200);break;
    case'buy':
      tone(880,.06);setTimeout(()=>tone(1100,.06),70);setTimeout(()=>tone(1320,.08),140);break;
    case'whoosh':
      // Barbell moving through air
      for(let i=0;i<5;i++)setTimeout(()=>tone(300+i*100,.03,'sawtooth',.03),i*20);break;
    case'stomp':
      // Feet stomping (recovery phase)
      tone(80,.1,'sawtooth',.1);tone(100,.08,'square',.06);break;
    case'breath':
      // Deep breath before lift
      tone(150,.5,'sine',.04);setTimeout(()=>tone(180,.4,'sine',.03),500);break;
    case'crowd':
      // Crowd rumble
      for(let i=0;i<12;i++)setTimeout(()=>tone(200+Math.random()*300,.08,'sawtooth',.015),i*50);break;
    case'newday':
      tone(440,.15,'sine',.08);setTimeout(()=>tone(554,.15,'sine',.07),200);
      setTimeout(()=>tone(659,.2,'sine',.06),400);break;
    case'unlock':
      [659,784,988,1319].forEach((f,i)=>setTimeout(()=>tone(f,.1,'square',.08),i*100));break;
    case'countdown3':tone(440,.2);break;
    case'countdown2':tone(440,.2);break;
    case'countdown1':tone(440,.2);break;
    case'countdownGo':tone(880,.15);setTimeout(()=>tone(880,.15),150);setTimeout(()=>tone(1320,.25),300);break;
    case'drumroll':for(let i=0;i<20;i++)setTimeout(()=>tone(200+Math.random()*100,.03,'sawtooth',.04),i*40);break;
    case'whoaaa':for(let i=0;i<10;i++)setTimeout(()=>tone(300+i*50,.08,'square',.03),i*50);break;
  }
}

// ═══════════════════════════════════════
// LIVE COMMENTARY (Web Speech Synthesis)
// ═══════════════════════════════════════
function commentary(text){
  if('speechSynthesis' in window){
    const u=new SpeechSynthesisUtterance(text);
    u.lang='en-US';
    u.rate=1.1;
    u.pitch=1.0;
    u.volume=0.7;
    const voices=speechSynthesis.getVoices();
    const en=voices.find(v=>v.lang.startsWith('en'));
    if(en)u.voice=en;
    speechSynthesis.speak(u);
  }
}

// ═══════════════════════════════════════
// 8-BIT CHIPTUNE BGM ENGINE
// ═══════════════════════════════════════

// BGM uses mp3 file instead of synth

// BGM uses mp3 file
var bgmAudio=null;
const _OLD_BGM_TRACKS={

  // ── Title: Warm morning feel, "Welcome home, sit down, relax" ──
  title:{
    tempo:108,
    melody:[
      // Phrase 1: gentle opening on the 3rd (E), stepwise with rests
      [N.E5,1.5],[N.R,.5],[N.G5,1],[N.A5,.5],[N.G5,.5],
      [N.E5,2],[N.R,2],
      // Phrase 2: meandering up, dotted rhythm
      [N.G5,1.5],[N.A5,.5],[N.C6,1],[N.R,1],
      [N.A5,.5],[N.G5,.5],[N.E5,2],[N.R,1],[N.D5,1],
      // Phrase 3: gentle descent
      [N.E5,1],[N.R,1],[N.G5,1.5],[N.E5,.5],
      [N.D5,1],[N.C5,2],[N.R,1],
      // Phrase 4: repeat motif with variation, ending on root
      [N.E5,1.5],[N.R,.5],[N.G5,1],[N.A5,1],
      [N.G5,.5],[N.E5,.5],[N.D5,1],[N.R,1],
      [N.E5,1],[N.D5,.5],[N.C5,.5],[N.R,1],[N.C5,2],
      [N.R,2],
      // Phrase 5: higher register echo, dreamy
      [N.C6,1.5],[N.R,.5],[N.A5,1],[N.G5,1],
      [N.R,1],[N.E5,1.5],[N.D5,.5],[N.C5,2],
      [N.R,2],
      // Phrase 6: soft closing, settling on C
      [N.G5,1],[N.E5,1],[N.R,1],[N.D5,1],
      [N.C5,2],[N.R,2],
    ],
    bass:[
      // C - F - G - Am pattern, soft root notes
      [N.C3,4],[N.R,4],
      [N.F3,4],[N.R,4],
      [N.G3,4],[N.R,4],
      [N.A3,4],[N.E3,4],
      [N.C3,4],[N.R,4],
      [N.F3,4],[N.R,4],
      [N.G3,4],[N.R,4],
      [N.C3,4],[N.R,4],
    ],
    drums:false,
  },

  // ── Training: Bouncy, playful, like AC shop music ──
  training:{
    tempo:116,
    melody:[
      // Phrase 1: playful bounce in G major
      [N.B4,1],[N.D5,.5],[N.R,.5],[N.G5,1.5],[N.R,.5],
      [N.E5,.5],[N.D5,.5],[N.B4,1],[N.R,1],
      // Phrase 2: skip up, gentle
      [N.D5,1],[N.R,.5],[N.G5,.5],[N.A5,1],[N.G5,.5],[N.R,.5],
      [N.E5,1],[N.D5,1],[N.R,1],
      // Phrase 3: bouncy repeat with variation
      [N.B4,.5],[N.D5,.5],[N.G5,1.5],[N.R,.5],
      [N.A5,.5],[N.G5,.5],[N.E5,1],[N.D5,1],[N.R,1],
      // Phrase 4: higher playful bit
      [N.G5,1],[N.R,.5],[N.A5,.5],[N.B5,1.5],[N.R,.5],
      [N.A5,.5],[N.G5,.5],[N.E5,1],[N.R,1],
      [N.D5,1],[N.B4,1],[N.R,1],[N.G4,1],
      // Phrase 5: happy resolution
      [N.B4,1.5],[N.R,.5],[N.D5,1],[N.G5,1],
      [N.R,1],[N.E5,.5],[N.D5,.5],[N.B4,2],
      [N.R,2],
      // Phrase 6: gentle ending
      [N.D5,1],[N.E5,.5],[N.D5,.5],[N.B4,1],[N.R,1],
      [N.G4,2],[N.R,2],
    ],
    bass:[
      // Walking bass feel, G-C-D-Em, soft
      [N.G3,2],[N.R,1],[N.B3,1],
      [N.C3,2],[N.R,1],[N.E3,1],
      [N.D3,2],[N.R,1],[N.A3,1],
      [N.E3,2],[N.R,1],[N.B3,1],
      [N.G3,2],[N.R,1],[N.D3,1],
      [N.C3,2],[N.R,1],[N.G3,1],
      [N.D3,2],[N.R,1],[N.A3,1],
      [N.G3,2],[N.R,2],
    ],
    drums:true,
  },

  // ── Competition: Exciting but pleasant, like AC event music ──
  competition:{
    tempo:126,
    melody:[
      // Phrase 1: ascending energy in D major
      [N.A4,1],[N.R,.5],[N.D5,.5],[N.E5,1],[N.R,.5],[N.Gb5,.5],
      [N.A5,1.5],[N.R,.5],[N.Gb5,1],
      [N.E5,.5],[N.D5,.5],[N.R,1],
      // Phrase 2: building excitement
      [N.D5,.5],[N.E5,.5],[N.Gb5,1],[N.A5,1],[N.R,1],
      [N.B5,1.5],[N.A5,.5],[N.Gb5,1],[N.E5,1],
      [N.R,1],[N.D5,1],
      // Phrase 3: peak phrase
      [N.A5,1],[N.R,.5],[N.B5,.5],[N.D6,1.5],[N.R,.5],
      [N.B5,.5],[N.A5,.5],[N.Gb5,1],[N.R,1],
      [N.E5,1],[N.D5,1],
      // Phrase 4: resolution with energy
      [N.Gb5,1.5],[N.R,.5],[N.A5,1],[N.B5,.5],[N.A5,.5],
      [N.Gb5,1],[N.E5,1],[N.R,1],
      [N.D5,2],[N.R,1],
      // Phrase 5: triumphant repeat
      [N.A5,1],[N.B5,.5],[N.R,.5],[N.D6,1.5],[N.R,.5],
      [N.B5,1],[N.A5,.5],[N.Gb5,.5],[N.E5,1],
      [N.D5,2],[N.R,2],
    ],
    bass:[
      // More active bass, D-G-A-Bm, gentle drive
      [N.D3,2],[N.A3,2],
      [N.G3,2],[N.D3,2],
      [N.A3,2],[N.E3,2],
      [N.B3,2],[N.Gb3,2],
      [N.D3,2],[N.A3,2],
      [N.G3,2],[N.D3,2],
      [N.A3,2],[N.E3,2],
      [N.D3,2],[N.R,2],
    ],
    drums:true,
  },

  // ── Shop: The coziest, like Nook's Cranny music ──
  shop:{
    tempo:96,
    melody:[
      // Phrase 1: very slow, dreamy in F major
      [N.A5,2],[N.R,1],[N.G5,1],
      [N.F5,2],[N.R,2],
      // Phrase 2: gentle sustained notes
      [N.C5,1.5],[N.R,.5],[N.D5,1],[N.F5,1],
      [N.R,1],[N.E5,2],[N.R,1],
      // Phrase 3: soft wandering
      [N.F5,1.5],[N.R,.5],[N.A5,2],
      [N.G5,1],[N.F5,1],[N.R,2],
      // Phrase 4: dreamy descent
      [N.A5,1.5],[N.R,.5],[N.G5,1.5],[N.R,.5],
      [N.F5,1],[N.E5,1],[N.R,1],[N.D5,1],
      [N.C5,2],[N.R,2],
      // Phrase 5: gentle echo
      [N.F5,2],[N.R,1],[N.E5,1],
      [N.D5,1.5],[N.R,.5],[N.C5,2],
      [N.R,2],
      // Phrase 6: soft resolution
      [N.D5,1],[N.R,1],[N.C5,1],[N.R,1],
      [N.F4,2],[N.R,2],
    ],
    bass:[
      // Minimal, just occasional root notes
      [N.F3,4],[N.R,4],
      [N.C3,4],[N.R,4],
      [N.F3,4],[N.R,4],
      [N.Bb3,4],[N.R,4],
      [N.F3,4],[N.R,4],
      [N.C3,4],[N.R,4],
    ],
    drums:false,
  },

  // ── Victory: Celebratory but warm, like AC achievement jingle ──
  victory:{
    tempo:120,
    melody:[
      // Phrase 1: ascending, sweet build
      [N.E5,1],[N.R,.5],[N.G5,.5],[N.A5,1.5],[N.R,.5],
      [N.C6,1],[N.R,1],
      // Phrase 2: triumphant climb
      [N.G5,.5],[N.A5,.5],[N.C6,1],[N.D6,1.5],[N.R,.5],
      [N.E6,2],[N.R,1],
      // Phrase 3: sweet echo down and up
      [N.D6,1],[N.C6,.5],[N.R,.5],[N.A5,1],[N.G5,1],
      [N.R,.5],[N.A5,.5],[N.C6,1.5],[N.R,.5],
      // Phrase 4: proud resolution — ends on high sustained note
      [N.D6,.5],[N.E6,.5],[N.G6,1],[N.R,1],
      [N.E6,1],[N.D6,.5],[N.C6,.5],[N.R,1],
      [N.C6,1],[N.E6,1],[N.G6,3],
      [N.R,2],
    ],
    bass:[
      // Strong supportive chords, C-F-G-C
      [N.C3,2],[N.G3,2],
      [N.F3,2],[N.C3,2],
      [N.G3,2],[N.E3,2],
      [N.F3,2],[N.G3,2],
      [N.C3,2],[N.E3,1],[N.G3,1],
      [N.C3,3],[N.R,2],
    ],
    drums:true,
  },
};

var bgmGeneration=0;

// Synth BGM patterns for different locations (simple looping melodies)
var synthBGMInterval=null;
var synthBGMType=null;
const SYNTH_PATTERNS={
  training:{notes:[262,330,392,330,262,294,349,294],tempo:200,wave:'sine'},
  competition:{notes:[330,392,494,392,330,294,262,294,330,392,494,587],tempo:150,wave:'square'},
  shop:{notes:[349,440,349,330,294,262,294,330],tempo:280,wave:'sine'},
  friend:{notes:[392,440,494,440,392,349,330,349],tempo:250,wave:'sine'},
  nature:{notes:[262,330,392,494,392,330,262,196],tempo:300,wave:'sine'},
  work:{notes:[262,294,330,349,330,294,262,247],tempo:220,wave:'triangle'},
  relax:{notes:[196,262,330,294,262,247,196,220],tempo:320,wave:'sine'},
};

function stopSynthBGM(){
  if(synthBGMInterval){clearInterval(synthBGMInterval);synthBGMInterval=null}
  synthBGMType=null;
}

function playSynthBGM(type){
  if(synthBGMType===type)return;
  stopSynthBGM();
  const pat=SYNTH_PATTERNS[type];
  if(!pat||audioMuted)return;
  synthBGMType=type;
  let idx=0;
  ea();
  synthBGMInterval=setInterval(()=>{
    if(audioMuted||!bgmPlaying){return}
    const freq=pat.notes[idx%pat.notes.length];
    if(freq>0){
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type=pat.wave;o.frequency.value=freq;
      g.gain.value=bgmVol*0.15;
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+pat.tempo/1000*0.9);
      o.connect(g);g.connect(masterGain);
      o.start();o.stop(ctx.currentTime+pat.tempo/1000);
    }
    idx++;
  },pat.tempo);
}

function stopBGM(){
  bgmPlaying=false;currentBGM=null;
  if(bgmAudio){bgmAudio.pause();bgmAudio.currentTime=0;}
  stopSynthBGM();
}

// BGM track mapping
const BGM_TRACK_TYPE={
  title:'mp3',hub:'mp3',create:'mp3',
  training:'synth',competition:'synth',shop:'synth',
  friend:'synth',nature:'synth',work:'synth',relax:'synth',
};
const BGM_SYNTH_MAP={
  training:'training',competition:'competition',shop:'shop',
  friend:'friend',nature:'nature',work:'work',relax:'relax',
};

function playBGM(trackName){
  if(currentBGM===trackName&&bgmPlaying)return;
  stopBGM();
  currentBGM=trackName;bgmPlaying=true;

  const trackType=BGM_TRACK_TYPE[trackName]||'synth';

  if(trackType==='mp3'){
    // Play mp3 for title/hub/create
    if(!bgmAudio){
      bgmAudio=new Audio('阿神BGM.mp3');
      bgmAudio.loop=true;
    }
    bgmAudio.volume=audioMuted?0:bgmVol;
    bgmAudio.play().catch(()=>{});
  }else{
    // Pause mp3 if playing
    if(bgmAudio&&!bgmAudio.paused)bgmAudio.pause();
    // Play synth pattern
    const synthType=BGM_SYNTH_MAP[trackName]||'shop';
    playSynthBGM(synthType);
  }
}
// Start BGM on first user click (browser autoplay policy)
document.addEventListener('click',function(){
  if(bgmAudio&&bgmAudio.paused&&bgmPlaying&&!audioMuted){
    bgmAudio.play().catch(()=>{});
  }
},{once:false});
// Pause BGM when app goes to background, resume when back
document.addEventListener('visibilitychange',function(){
  if(!bgmAudio)return;
  if(document.hidden){
    bgmAudio.pause();
  }else{
    if(bgmPlaying&&!audioMuted)bgmAudio.play().catch(()=>{});
  }
});

// ═══════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════
function spawnConfetti(n=30){
  const cols=['#f4d03f','#ef7d57','#b13e53','#38b764','#3b5dc9','#73eff7','#a7f070'];
  for(let i=0;i<n;i++){const el=document.createElement('div');el.className='confetti';el.style.left=Math.random()*100+'vw';el.style.background=cols[Math.floor(Math.random()*cols.length)];el.style.animationDuration=(1.5+Math.random())+'s';el.style.animationDelay=(Math.random()*.5)+'s';el.style.borderRadius=Math.random()>.5?'50%':'0';document.body.appendChild(el);setTimeout(()=>el.remove(),3000);}
}
