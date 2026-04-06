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
var bgmVol=0;
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
    u.rate=0.85;
    u.pitch=1.0;
    u.volume=1.0;
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

var bgmAudio=null;


var bgmGeneration=0;


function stopBGM(){
  bgmPlaying=false;currentBGM=null;
  if(bgmAudio){bgmAudio.pause();bgmAudio.currentTime=0;}
}

function playBGM(trackName){
  if(bgmAudio&&!bgmAudio.paused&&bgmPlaying)return;
  currentBGM=trackName;bgmPlaying=true;
  if(!bgmAudio){
    bgmAudio=new Audio('阿神BGM.mp3');
    bgmAudio.loop=true;
  }
  bgmAudio.volume=audioMuted?0:bgmVol;
  bgmAudio.play().catch(function(){});
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
