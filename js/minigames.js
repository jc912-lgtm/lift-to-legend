// ── Mini-Game: BreathGame (呼吸節奏) ──
// Circle expands/contracts, tap when it matches target
function BreathGame({onResult,difficulty,successRate}){
  const[phase,setPhase]=useState(0);
  const[done,setDone]=useState(false);
  const[result,setResult]=useState(null);
  const speed=0.4+difficulty*0.6;
  const phaseRef=useRef(0);

  useEffect(()=>{
    if(done)return;
    let p=0,d=1;
    const tick=()=>{
      p+=d*speed;
      if(p>=100)d=-1;if(p<=0)d=1;
      phaseRef.current=p;
      setPhase(p);
    };
    const id=setInterval(tick,20);
    return()=>clearInterval(id);
  },[done]);

  function handleTap(){
    if(done)return;
    setDone(true);
    const dist=Math.abs(phaseRef.current-50);
    // Timing-based: good timing = success, no random roll needed!
    let res;
    if(dist<18) res='perfect';
    else if(dist<35) res='good';
    else res='fail';
    setResult(res);
    sfx(res==='fail'?'fail':'tap');
    setTimeout(()=>onResult(res),600);
  }

  const targetSize=60;
  const currentSize=30+phase*0.6;

  return(
    <div className="flex flex-col items-center gap-2">
      <div className="font-vt text-pixel-cyan text-sm">🫁 圓圈對齊時點擊！</div>
      <div className="relative w-28 h-28 flex items-center justify-center cursor-pointer"
        onClick={handleTap} onTouchStart={e=>{e.preventDefault();handleTap()}}>
        {/* Target ring */}
        <div className="absolute rounded-full opacity-50"
          style={{width:targetSize,height:targetSize,borderWidth:3,borderStyle:'solid',borderColor:'#f4d03f'}}/>
        {/* Sweet spot highlight */}
        <div className="absolute rounded-full opacity-20"
          style={{width:targetSize+10,height:targetSize+10,borderWidth:8,borderStyle:'solid',borderColor:'#38b764'}}/>
        {/* Moving circle */}
        <div className={`rounded-full transition-none ${result==='perfect'?'bg-pixel-gold':result==='good'?'bg-pixel-green':result==='fail'?'bg-pixel-red':'bg-pixel-sky'}`}
          style={{width:currentSize,height:currentSize,opacity:result?1:0.6,transition:result?'all .2s':'none'}}/>
      </div>
      {result&&<div className={`font-vt text-lg ${result==='perfect'?'text-pixel-gold':result==='good'?'text-pixel-green':'text-pixel-red'}`}>
        {result==='perfect'?'🌟完美！':result==='good'?'✅不錯':'❌太早/太晚'}
      </div>}
      {!done&&<div className="font-vt text-pixel-light text-xs">點擊畫面！</div>}
    </div>
  );
}

// ── Mini-Game: MashGame (連打爆發) ──
// Tap rapidly to fill a power gauge before time runs out
function MashGame({onResult,difficulty,successRate}){
  const[power,setPower]=useState(0);
  const[done,setDone]=useState(false);
  const[result,setResult]=useState(null);
  const[timeLeft,setTimeLeft]=useState(100);
  // Lower threshold = easier to fill
  const threshold=30+difficulty*10;
  const decay=0.1+difficulty*0.1;
  const powerRef=useRef(0);
  const doneRef=useRef(false);

  useEffect(()=>{
    if(done)return;
    const id=setInterval(()=>{
      if(doneRef.current)return;
      powerRef.current=Math.max(0,powerRef.current-decay);
      setPower(powerRef.current);
      setTimeLeft(t=>{
        const next=t-1;
        if(next<=0){
          doneRef.current=true;
          setDone(true);
          const p=powerRef.current;
          // Pure skill: did you tap enough?
          const res=p>=threshold?'perfect':p>=threshold*0.6?'good':'fail';
          setResult(res);
          sfx(res==='fail'?'fail':res==='perfect'?'perfect':'success');
          setTimeout(()=>onResult(res),600);
          return 0;
        }
        return next;
      });
    },30);
    return()=>clearInterval(id);
  },[done]);

  function handleTap(){
    if(done||doneRef.current)return;
    // Each tap gives big power boost
    const gain=6;
    powerRef.current=Math.min(100,powerRef.current+gain);
    setPower(powerRef.current);
    sfx('tap');
  }

  const barColor=power>=threshold?'#f4d03f':power>=threshold*0.6?'#38b764':'#3b5dc9';

  return(
    <div className="flex flex-col items-center gap-2">
      <div className="font-vt text-pixel-orange text-sm">👆 瘋狂連點！</div>
      {/* Time bar */}
      <div className="w-48 h-2 bg-pixel-dark border border-pixel-gray overflow-hidden rounded">
        <div className="h-full bg-pixel-red transition-none" style={{width:`${timeLeft}%`}}/>
      </div>
      {/* Power bar */}
      <div className="w-48 h-10 bg-pixel-dark border-2 border-pixel-gray relative overflow-hidden cursor-pointer rounded"
        onClick={handleTap} onTouchStart={e=>{e.preventDefault();handleTap()}}>
        <div className="h-full transition-none" style={{width:`${power}%`,background:barColor}}/>
        {/* Threshold line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-pixel-gold" style={{left:`${threshold}%`}}/>
        <div className="absolute inset-0 flex items-center justify-center font-pixel text-white text-[8px]" style={{textShadow:'1px 1px 0 #000'}}>
          {done?(result==='perfect'?'🌟完美！':result==='good'?'✅不錯':'❌不夠力'):'TAP! TAP! TAP!'}
        </div>
      </div>
      {!done&&<button onClick={handleTap} onTouchStart={e=>{e.preventDefault();handleTap()}}
        className="pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold px-8 py-3 text-xs font-pixel active:scale-95 select-none">
        💪 連打！
      </button>}
      {result&&<div className={`font-vt text-lg ${result==='perfect'?'text-pixel-gold':result==='good'?'text-pixel-green':'text-pixel-red'}`}>
        {result==='perfect'?'🌟爆發力十足！':result==='good'?'✅有力量！':'❌再快一點！'}
      </div>}
    </div>
  );
}

// ── Mini-Game: RingGame (縮圈精準) ──
// Ring shrinks toward target, tap when overlapping
function RingGame({onResult,difficulty,successRate}){
  const[ringSize,setRingSize]=useState(120);
  const[done,setDone]=useState(false);
  const[result,setResult]=useState(null);
  const speed=0.25+difficulty*0.15;
  const targetSize=45;
  const ringSizeRef=useRef(120);
  const doneRef=useRef(false);

  useEffect(()=>{
    if(done)return;
    const id=setInterval(()=>{
      if(doneRef.current)return;
      ringSizeRef.current-=speed;
      if(ringSizeRef.current<=5){
        doneRef.current=true;
        setDone(true);setResult('fail');sfx('fail');
        setRingSize(5);
        setTimeout(()=>onResult('fail'),600);
        return;
      }
      setRingSize(ringSizeRef.current);
    },16);
    return()=>clearInterval(id);
  },[done]);

  function handleTap(){
    if(done||doneRef.current)return;
    doneRef.current=true;
    setDone(true);
    const diff=Math.abs(ringSizeRef.current-targetSize);
    // Pure timing: close to target = success
    let res;
    if(diff<12) res='perfect';
    else if(diff<25) res='good';
    else res='fail';
    setResult(res);
    sfx(res==='fail'?'fail':res==='perfect'?'perfect':'tap');
    setTimeout(()=>onResult(res),600);
  }

  return(
    <div className="flex flex-col items-center gap-2">
      <div className="font-vt text-pixel-cyan text-sm">⭕ 圈圈對齊時點擊！</div>
      <div className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
        onClick={handleTap} onTouchStart={e=>{e.preventDefault();handleTap()}}>
        {/* Target circle (fixed, with glow) */}
        <div className="absolute rounded-full"
          style={{width:targetSize*2,height:targetSize*2,borderWidth:4,borderStyle:'solid',borderColor:'#f4d03f',
            boxShadow:'0 0 10px rgba(244,208,63,.3), inset 0 0 10px rgba(244,208,63,.1)'}}/>
        {/* Shrinking ring */}
        {!done&&<div className="absolute rounded-full transition-none"
          style={{width:ringSize*2,height:ringSize*2,borderWidth:3,borderStyle:'solid',borderColor:'#73eff7',opacity:.8}}/>}
        {/* Center dot */}
        <div className="w-3 h-3 rounded-full bg-pixel-gold"/>
        {/* Result */}
        {result&&<div className="absolute text-3xl pop-in">
          {result==='perfect'?'🌟':result==='good'?'✅':'❌'}
        </div>}
      </div>
      {!done&&<div className="font-vt text-pixel-light text-xs">等圓圈縮到金色範圍！</div>}
      {result&&<div className={`font-vt text-lg ${result==='perfect'?'text-pixel-gold':result==='good'?'text-pixel-green':'text-pixel-red'}`}>
        {result==='perfect'?'🌟精準！':result==='good'?'✅可以！':'❌沒對準'}
      </div>}
    </div>
  );
}

// ── Mini-Game: HoldGame (連擊站起來！) ──
// Rapid tap to fill a "stand up" gauge — represents recovery/lockout
function HoldGame({onResult,difficulty,successRate}){
  const[power,setPower]=useState(0);
  const[done,setDone]=useState(false);
  const[result,setResult]=useState(null);
  const[timeLeft,setTimeLeft]=useState(100);
  const threshold=35+difficulty*8;
  const decay=0.12+difficulty*0.08;
  const powerRef=useRef(0);
  const doneRef=useRef(false);

  useEffect(()=>{
    if(done)return;
    const id=setInterval(()=>{
      if(doneRef.current)return;
      powerRef.current=Math.max(0,powerRef.current-decay);
      setPower(powerRef.current);
      setTimeLeft(t=>{
        const next=t-1.2;
        if(next<=0){
          doneRef.current=true;setDone(true);
          const p=powerRef.current;
          const res=p>=threshold?'perfect':p>=threshold*0.6?'good':'fail';
          setResult(res);sfx(res==='fail'?'fail':res==='perfect'?'perfect':'success');
          setTimeout(()=>onResult(res),600);
          return 0;
        }
        return next;
      });
    },30);
    return()=>clearInterval(id);
  },[done]);

  function handleTap(){
    if(done||doneRef.current)return;
    powerRef.current=Math.min(100,powerRef.current+6);
    setPower(powerRef.current);
    sfx('tap');
  }

  const barColor=power>=threshold?'#f4d03f':power>=threshold*0.6?'#38b764':'#3b5dc9';

  return(
    <div className="flex flex-col items-center gap-2">
      <div className="font-vt text-pixel-lime text-sm">🦵 連打站起來！</div>
      <div className="w-48 h-2 bg-pixel-dark border border-pixel-gray overflow-hidden rounded">
        <div className="h-full bg-pixel-red transition-none" style={{width:`${timeLeft}%`}}/>
      </div>
      <div className="w-48 h-10 bg-pixel-dark border-2 border-pixel-gray relative overflow-hidden cursor-pointer rounded"
        onClick={handleTap} onTouchStart={e=>{e.preventDefault();handleTap()}}>
        <div className="h-full transition-none" style={{width:`${power}%`,background:barColor}}/>
        <div className="absolute top-0 bottom-0 w-0.5 bg-pixel-gold" style={{left:`${threshold}%`}}/>
        <div className="absolute inset-0 flex items-center justify-center font-pixel text-white text-[8px]" style={{textShadow:'1px 1px 0 #000'}}>
          {done?(result==='perfect'?'🌟完美站起！':result==='good'?'✅站穩了！':'❌腿軟了...'):'站起來！TAP!'}
        </div>
      </div>
      {!done&&<button onClick={handleTap} onTouchStart={e=>{e.preventDefault();handleTap()}}
        className="pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold px-8 py-3 text-xs font-pixel active:scale-95 select-none">
        🦵 站起來！
      </button>}
      {result&&<div className={`font-vt text-lg ${result==='perfect'?'text-pixel-gold':result==='good'?'text-pixel-green':'text-pixel-red'}`}>
        {result==='perfect'?'🌟完美恢復！':result==='good'?'✅站穩了！':'❌腿軟...'}
      </div>}
    </div>
  );
}

// ── LiftControl: Real-time single-screen lift mechanic ──
// Replaces sequential mini-games with a continuous dashboard control
function LiftControl({liftType,difficulty,stats,onResult,weight}){
  const[phase,setPhase]=useState('pull'); // pull, timing, stabilize, jerk, done
  const[pullPower,setPullPower]=useState(0);
  const[timerAngle,setTimerAngle]=useState(-90);
  const[balancePos,setBalancePos]=useState(50);
  const[result,setResult]=useState(null);
  const[holding,setHolding]=useState(false);
  const[stabilizeTime,setStabilizeTime]=useState(0);
  const[flash,setFlash]=useState(null);
  const[oppFlash,setOppFlash]=useState(null);

  const pullRef=useRef(0);
  const phaseRef=useRef('pull');
  const timerRef=useRef(-90);
  const balRef=useRef(50);
  const stabRef=useRef(0);
  const holdingRef=useRef(false);
  const doneRef=useRef(false);
  const resultRef=useRef(null);
  const perfectRef=useRef({pull:false,timing:false,stabilize:false,jerk:false});

  // Derived difficulty params from stats
  const tec=stats.tec||10;
  const str=stats.str||10;
  const pwr=stats.pwr||10;
  const stb=stats.stb||10;
  // Green zone size for timing: more TEC = bigger zone (20-60 degrees)
  const greenZoneSize=Math.max(20,Math.min(60,tec*0.5+10));
  const greenZoneStart=useRef(Math.floor(Math.random()*300)).current;
  // Wobble speed: heavier weight relative to STR = faster wobble
  const wobbleSpeed=Math.max(0.8,Math.min(3.5,2.5-str*0.015+(difficulty||0.5)*1.2));
  // Spin speed for timing ring
  const spinSpeed=Math.max(2,Math.min(5,3+(difficulty||0.5)*2-tec*0.01));

  // ── PULL PHASE: hold to charge ──
  useEffect(()=>{
    if(doneRef.current)return;
    const id=setInterval(()=>{
      if(doneRef.current)return;
      const p=phaseRef.current;

      if(p==='pull'){
        if(holdingRef.current){
          pullRef.current=Math.min(100,pullRef.current+2.2+pwr*0.02);
        }else{
          pullRef.current=Math.max(0,pullRef.current-0.6);
        }
        setPullPower(pullRef.current);
      }

      if(p==='timing'){
        timerRef.current=(timerRef.current+spinSpeed)%360;
        setTimerAngle(timerRef.current);
      }

      if(p==='stabilize'){
        // Wobble physics
        const wobble=(Math.sin(Date.now()*0.004*wobbleSpeed)*30+Math.sin(Date.now()*0.007*wobbleSpeed)*15)*(1-stb*0.005);
        const target=50+wobble;
        if(holdingRef.current){
          // Holding = resist wobble, pull toward center
          balRef.current+=(50-balRef.current)*0.08;
        }else{
          balRef.current+=(target-balRef.current)*0.12;
        }
        balRef.current=Math.max(0,Math.min(100,balRef.current));
        setBalancePos(balRef.current);

        // Check stable (within center zone)
        if(Math.abs(balRef.current-50)<15){
          stabRef.current+=1;
          setStabilizeTime(stabRef.current);
          if(stabRef.current>=60){ // ~2 seconds at 30fps
            if(!doneRef.current){
              const isPerfect=Math.abs(balRef.current-50)<8;
              perfectRef.current.stabilize=isPerfect;
              if(liftType==='cleanJerk'){
                // Move to jerk phase
                phaseRef.current='jerk';
                setPhase('jerk');
                holdingRef.current=false;
                setHolding(false);
                timerRef.current=-90;
                setTimerAngle(-90);
                sfx('phase');
                setFlash('JERK!');
                setTimeout(()=>setFlash(null),500);
              }else{
                finishLift(true);
              }
            }
          }
        }else{
          stabRef.current=Math.max(0,stabRef.current-2);
          setStabilizeTime(stabRef.current);
        }
        // Fail if way off center
        if(balRef.current<=3||balRef.current>=97){
          if(!doneRef.current)finishLift(false,'stabilize');
        }
      }

      if(p==='jerk'){
        timerRef.current=(timerRef.current+spinSpeed*1.2)%360;
        setTimerAngle(timerRef.current);
      }
    },33);
    return()=>clearInterval(id);
  },[]);

  function finishLift(success,failPhase){
    if(doneRef.current)return;
    doneRef.current=true;
    const perf=perfectRef.current;
    const perfectCount=[perf.pull,perf.timing,perf.stabilize,perf.jerk].filter(Boolean).length;
    const isPerfect=success&&perfectCount>=(liftType==='cleanJerk'?3:2);
    const res={success,perfect:isPerfect,phase:failPhase||'done',perfectCount};
    resultRef.current=res;
    setResult(res);
    setPhase('done');
    phaseRef.current='done';
    if(success){
      sfx(isPerfect?'perfect':'success');
      if(isPerfect)spawnConfetti(12);
      commentary(isPerfect?'Beautiful! Perfect technique!':`Good lift! ${weight} kilograms!`);
    }else{
      sfx('slam');sfx('fail');
      commentary('No lift. The bar is dropped.');
    }
    setTimeout(()=>onResult(res),success?800:1000);
  }

  // ── TAP/HOLD handlers ──
  function handleDown(e){
    if(e)e.preventDefault();
    if(doneRef.current)return;
    holdingRef.current=true;
    setHolding(true);

    if(phaseRef.current==='pull'){
      sfx('lift');
      commentary(`And... pull!`);
    }
  }

  function handleUp(e){
    if(e)e.preventDefault();
    holdingRef.current=false;
    setHolding(false);
    if(doneRef.current)return;

    const p=phaseRef.current;

    if(p==='pull'){
      // Release = commit to pull. Check if enough power.
      if(pullRef.current>=70){
        const isPerfect=pullRef.current>=90;
        perfectRef.current.pull=isPerfect;
        phaseRef.current='timing';
        setPhase('timing');
        sfx('phase');
        sfx('whoosh');
        setFlash(isPerfect?'PERFECT PULL!':'GOOD!');
        setTimeout(()=>setFlash(null),500);
      }else if(pullRef.current>=30){
        // Partial pull — still advances but not perfect
        perfectRef.current.pull=false;
        phaseRef.current='timing';
        setPhase('timing');
        sfx('phase');
        setFlash('WEAK PULL...');
        setTimeout(()=>setFlash(null),500);
      }
      // If below 30, just resets — player can try again
    }
  }

  function handleTap(e){
    if(e)e.preventDefault();
    if(doneRef.current)return;
    const p=phaseRef.current;

    if(p==='timing'||p==='jerk'){
      // Check if indicator is in green zone
      const angle=(timerRef.current+360)%360;
      const gStart=greenZoneStart;
      const gEnd=(greenZoneStart+greenZoneSize)%360;
      let inZone=false;
      if(gEnd>gStart){
        inZone=angle>=gStart&&angle<=gEnd;
      }else{
        inZone=angle>=gStart||angle<=gEnd;
      }
      // Also check "near" the zone for good (not perfect)
      const nearMargin=15;
      let nearZone=false;
      const gStartN=(gStart-nearMargin+360)%360;
      const gEndN=(gEnd+nearMargin)%360;
      if(gEndN>gStartN){
        nearZone=angle>=gStartN&&angle<=gEndN;
      }else{
        nearZone=angle>=gStartN||angle<=gEndN;
      }

      if(inZone){
        if(p==='timing'){
          perfectRef.current.timing=true;
          phaseRef.current='stabilize';
          setPhase('stabilize');
          stabRef.current=0;
          balRef.current=50;
          sfx('phase');
          setFlash('PERFECT TIMING!');
          setTimeout(()=>setFlash(null),500);
        }else{
          // jerk phase — success!
          perfectRef.current.jerk=true;
          sfx('phase');
          setFlash('LOCKED OUT!');
          setTimeout(()=>setFlash(null),500);
          finishLift(true);
        }
      }else if(nearZone){
        if(p==='timing'){
          perfectRef.current.timing=false;
          phaseRef.current='stabilize';
          setPhase('stabilize');
          stabRef.current=0;
          balRef.current=50;
          sfx('tap');
          setFlash('OK TIMING');
          setTimeout(()=>setFlash(null),500);
        }else{
          perfectRef.current.jerk=false;
          finishLift(true);
        }
      }else{
        // Miss — fail
        sfx('fail');
        finishLift(false,p);
      }
    }
  }

  // Phase-specific colors
  const phaseColors={pull:'#3b5dc9',timing:'#f4d03f',stabilize:'#38b764',jerk:'#ef7d57',done:'#566c86'};
  const activeColor=phaseColors[phase]||'#566c86';

  // Pull gauge arc calculation
  const pullArc=pullPower*2.2;
  const pullColor=pullPower>=90?'#f4d03f':pullPower>=70?'#38b764':pullPower>=30?'#ef7d57':'#b13e53';

  // Timer indicator position
  const tRad=42;
  const tX=50+tRad*Math.cos(timerAngle*Math.PI/180);
  const tY=50+tRad*Math.sin(timerAngle*Math.PI/180);

  // Green zone arc for SVG
  const gzStartAngle=greenZoneStart;
  const gzEndAngle=(greenZoneStart+greenZoneSize)%360;
  const gzStartRad=gzStartAngle*Math.PI/180;
  const gzEndRad=gzEndAngle*Math.PI/180;
  const gzX1=50+tRad*Math.cos(gzStartRad);
  const gzY1=50+tRad*Math.sin(gzStartRad);
  const gzX2=50+tRad*Math.cos(gzEndRad);
  const gzY2=50+tRad*Math.sin(gzEndRad);
  const gzLargeArc=greenZoneSize>180?1:0;

  // Stabilize progress ratio
  const stabProgress=Math.min(100,stabilizeTime/60*100);

  return(
    <div className="flex flex-col items-center gap-1 select-none">
      {/* Flash text */}
      {flash&&<div className="font-pixel text-pixel-gold text-xs pop-in" style={{textShadow:'2px 2px 0 #000'}}>{flash}</div>}

      {/* Phase indicators */}
      <div className="flex justify-center gap-1 mb-0.5">
        {['pull','timing','stabilize'].concat(liftType==='cleanJerk'?['jerk']:[]).map((p,i)=>{
          const isCurrent=p===phase;
          const isDone=(['pull','timing','stabilize','jerk'].indexOf(phase))>(['pull','timing','stabilize','jerk'].indexOf(p));
          const label={pull:'拉力',timing:'時機',stabilize:'穩定',jerk:'上挺'}[p];
          return(
            <div key={p} className={`px-1.5 py-0.5 border-2 rounded text-center font-vt text-xs transition-all
              ${isCurrent?'border-pixel-gold text-pixel-gold bg-pixel-darkblue phase-glow':
                isDone?'border-pixel-green text-pixel-green bg-pixel-dark':
                'border-pixel-gray text-pixel-gray bg-pixel-dark'}`}>
              {isDone?'✓':label}
            </div>
          );
        })}
      </div>

      {/* Three gauges in a row */}
      <div className="flex items-end justify-center gap-3">
        {/* Pull Gauge (left) */}
        <div className="text-center">
          <svg viewBox="0 0 80 80" width="68" height="68">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#333c57" strokeWidth="7"/>
            <circle cx="40" cy="40" r="35" fill="none" stroke={pullColor} strokeWidth="7"
              strokeDasharray={`${pullArc} 220`} strokeLinecap="round"
              transform="rotate(-90 40 40)" style={{transition:'stroke-dasharray 0.05s'}}/>
            {/* Threshold line at 70% */}
            <circle cx="40" cy="40" r="35" fill="none" stroke="#f4d03f" strokeWidth="1" opacity="0.4"
              strokeDasharray="2 218" strokeDashoffset={`${-70*2.2}`}
              transform="rotate(-90 40 40)"/>
            <text x="40" y="38" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="VT323,monospace">{Math.round(pullPower)}%</text>
            <text x="40" y="50" textAnchor="middle" fill={pullPower>=70?'#38b764':'#94b0c2'} fontSize="8" fontFamily="VT323,monospace">{pullPower>=70?'OK!':'70%+'}</text>
          </svg>
          <div className={`font-vt text-xs ${phase==='pull'?'text-pixel-gold':'text-pixel-gray'}`}>拉力</div>
        </div>

        {/* Timing Ring (center, largest) */}
        <div className="text-center">
          <svg viewBox="0 0 100 100" width="88" height="88">
            {/* Ring background */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="#333c57" strokeWidth="6"/>
            {/* Green zone arc */}
            {(phase==='timing'||phase==='jerk')&&
              <path d={`M${gzX1},${gzY1} A42,42 0 ${gzLargeArc} 1 ${gzX2},${gzY2}`}
                fill="none" stroke="#38b764" strokeWidth="10" opacity="0.45" strokeLinecap="round"/>
            }
            {/* Spinning indicator */}
            {(phase==='timing'||phase==='jerk')&&
              <circle cx={tX} cy={tY} r="6" fill="#f4d03f" stroke="#fff" strokeWidth="1.5">
                <animate attributeName="opacity" values="1;0.6;1" dur="0.4s" repeatCount="indefinite"/>
              </circle>
            }
            {/* Center text */}
            {phase==='pull'&&<text x="50" y="54" textAnchor="middle" fill="#566c86" fontSize="10" fontFamily="VT323,monospace">PULL</text>}
            {phase==='timing'&&<text x="50" y="54" textAnchor="middle" fill="#f4d03f" fontSize="11" fontFamily="VT323,monospace">TAP!</text>}
            {phase==='stabilize'&&<text x="50" y="54" textAnchor="middle" fill="#38b764" fontSize="10" fontFamily="VT323,monospace">HOLD</text>}
            {phase==='jerk'&&<text x="50" y="54" textAnchor="middle" fill="#ef7d57" fontSize="11" fontFamily="VT323,monospace">TAP!</text>}
            {phase==='done'&&<text x="50" y="54" textAnchor="middle" fill={result?.success?'#38b764':'#b13e53'} fontSize="12" fontFamily="VT323,monospace">{result?.success?'GOOD':'MISS'}</text>}
          </svg>
          <div className={`font-vt text-xs ${(phase==='timing'||phase==='jerk')?'text-pixel-gold':'text-pixel-gray'}`}>時機</div>
        </div>

        {/* Stability Bar (right) */}
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-56px flex flex-col items-center gap-0.5">
            {/* Stability progress ring */}
            <svg viewBox="0 0 80 80" width="68" height="68">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#333c57" strokeWidth="7"/>
              {phase==='stabilize'&&<circle cx="40" cy="40" r="35" fill="none" stroke="#38b764" strokeWidth="7"
                strokeDasharray={`${stabProgress*2.2} 220`} strokeLinecap="round"
                transform="rotate(-90 40 40)" style={{transition:'stroke-dasharray 0.1s'}}/>}
              {/* Balance indicator inside */}
              {phase==='stabilize'&&<>
                <line x1="15" y1="42" x2="65" y2="42" stroke="#566c86" strokeWidth="2"/>
                <rect x="35" y="38" width="10" height="8" rx="2" fill="#38b764" opacity="0.2"/>
                <circle cx={15+balancePos*0.5} cy="42" r="4" fill={Math.abs(balancePos-50)<15?'#38b764':'#b13e53'}>
                  <animate attributeName="opacity" values="1;0.7;1" dur="0.3s" repeatCount="indefinite"/>
                </circle>
              </>}
              {phase!=='stabilize'&&<text x="40" y="44" textAnchor="middle" fill="#566c86" fontSize="9" fontFamily="VT323,monospace">WAIT</text>}
              {phase==='stabilize'&&<text x="40" y="28" textAnchor="middle" fill="#38b764" fontSize="10" fontWeight="bold" fontFamily="VT323,monospace">{Math.round(stabProgress)}%</text>}
            </svg>
          </div>
          <div className={`font-vt text-xs ${phase==='stabilize'?'text-pixel-gold':'text-pixel-gray'}`}>穩定</div>
        </div>
      </div>

      {/* Action button (changes per phase) */}
      {phase==='pull'&&(
        <button
          onMouseDown={handleDown} onMouseUp={handleUp} onMouseLeave={()=>{holdingRef.current=false;setHolding(false)}}
          onTouchStart={handleDown} onTouchEnd={handleUp}
          className={`pixel-btn ${holding?'pixel-btn-gold':'pixel-btn'} bg-pixel-dark text-pixel-gold px-10 py-3 text-xs font-pixel active:scale-95`}
          style={{transform:holding?'translateY(2px)':'none'}}>
          {holding?'拉！！！':'按住 拉起！'}
        </button>
      )}
      {(phase==='timing'||phase==='jerk')&&(
        <button
          onClick={handleTap} onTouchStart={handleTap}
          className="pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold px-10 py-3 text-xs font-pixel active:scale-95 animate-pulse">
          {phase==='jerk'?'上挺！TAP!':'抓住時機！TAP!'}
        </button>
      )}
      {phase==='stabilize'&&(
        <button
          onMouseDown={handleDown} onMouseUp={handleUp} onMouseLeave={()=>{holdingRef.current=false;setHolding(false)}}
          onTouchStart={handleDown} onTouchEnd={handleUp}
          className={`pixel-btn ${holding?'pixel-btn-gold':'pixel-btn'} bg-pixel-dark text-pixel-gold px-10 py-3 text-xs font-pixel active:scale-95`}
          style={{transform:holding?'translateY(2px)':'none'}}>
          {holding?'穩住...':'按住 穩住！'}
        </button>
      )}
      {phase==='done'&&result&&(
        <div className={`font-pixel text-sm pop-in ${result.success?(result.perfect?'text-pixel-gold':'text-pixel-green'):'text-pixel-red'}`}>
          {result.success?(result.perfect?'PERFECT LIFT!':'GOOD LIFT!'):'NO LIFT'}
        </div>
      )}
    </div>
  );
}

// ── PhaseMeter (multi-phase coordinator) ──
// Renders the appropriate mini-game per phase (kept for backward compat)
function PhaseMeter({phases,onResult,difficulty,successRate}){
  const[currentPhase,setCurrentPhase]=useState(0);
  const[results,setResults]=useState([]);
  const[phaseResult,setPhaseResult]=useState(null);

  const phase=phases[currentPhase];

  function handlePhaseResult(res){
    setPhaseResult(res);
    const newResults=[...results,{phase:phase.id,result:res}];
    setResults(newResults);

    if(res==='fail'){
      sfx('fail');
      setTimeout(()=>onResult(newResults),800);
      return;
    }

    if(currentPhase<phases.length-1){
      setTimeout(()=>{
        setCurrentPhase(c=>c+1);
        setPhaseResult(null);
      },700);
    }else{
      sfx('success');
      setTimeout(()=>onResult(newResults),700);
    }
  }

  const GameComponent={breathe:BreathGame,mash:MashGame,ring:RingGame,hold:HoldGame}[phase.game]||BreathGame;

  return(
    <div className="w-full max-w-sm mx-auto slide-up">
      {/* Phase indicators */}
      <div className="flex justify-center gap-1 mb-2">
        {phases.map((p,i)=>{
          const r=results[i];
          const isCurrent=i===currentPhase;
          return(
            <div key={i} className={`px-1.5 py-0.5 border-2 rounded text-center font-vt text-xs
              ${isCurrent?'border-pixel-gold text-pixel-gold bg-pixel-darkblue phase-glow':
                r?r.result==='perfect'?'border-pixel-gold text-pixel-gold bg-pixel-dark':
                  r.result==='good'?'border-pixel-green text-pixel-green bg-pixel-dark':
                  'border-pixel-red text-pixel-red bg-pixel-dark':
                'border-pixel-gray text-pixel-gray bg-pixel-dark'}`}>
              {p.emoji}
            </div>
          );
        })}
      </div>

      {/* Current phase name */}
      <div className="text-center mb-2">
        <span className="font-pixel text-pixel-gold text-[10px]">{phase.emoji} {phase.name}</span>
      </div>

      {/* Render the appropriate mini-game */}
      {!phaseResult&&<GameComponent key={currentPhase} onResult={handlePhaseResult} difficulty={difficulty} successRate={successRate}/>}
    </div>
  );
}
